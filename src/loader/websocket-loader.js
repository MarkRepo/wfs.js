/*
 * Websocket Loader
*/

import Event from '../events';
import EventHandler from '../event-handler';
import H264Demuxer from '../demux/h264-demuxer';
import crc  from './crc.js';

class WebsocketLoader extends EventHandler {

  constructor(wfs) {
    super(wfs, 
    Event.WEBSOCKET_ATTACHING,
    Event.WEBSOCKET_DATA_UPLOADING,
    Event.WEBSOCKET_MESSAGE_SENDING)   
    this.buf = null;
    this.h264Demuxer = new H264Demuxer(wfs);    
    this.mediaType = undefined; 
    this.channelName = undefined; 
  }
 
  destroy() { 
    EventHandler.prototype.destroy.call(this);
  }

  onWebsocketAttaching(data) {
  	this.mediaType = data.mediaType; 
  	this.channelName = data.channelName;  
    if( data.websocket instanceof WebSocket ) {
      this.client = data.websocket;
      this.client.onopen = this.initSocketClient.bind(this);   
      this.client.onclose = function(e) {
          console.log('Websocket Disconnected!');
      }; 
    }    
  }

  initSocketClient(client){
    this.client.binaryType = 'arraybuffer';
    this.client.onmessage = this.receiveSocketMessage.bind(this);
    this.wfs.trigger(Event.WEBSOCKET_MESSAGE_SENDING, {commandType: "open", channelName:this.channelName, commandValue:"NA" });
    console.log('Websocket Open!'); 
  }
 
  receiveSocketMessage( event ){
    var buffer = new Uint8Array(event.data);
    console.log(buffer.length);
    var newBuffer;
    if(this.buf){
      newBuffer = new Uint8Array(this.buf.byteLength + buffer.byteLength);
      newBuffer.set(this.buf);
      newBuffer.set(buffer, this.buf.byteLength);
      console.log(newBuffer.length);
    }
    else
      newBuffer = new Uint8Array(buffer);
    //get len
    var offset = 0;
    var lenView = new DataView(newBuffer.buffer);
    var len = lenView.getUint32(0);  
    while(len < newBuffer.byteLength -4){
      console.log("frames, len:" + len);
      var copy = newBuffer.subarray(4, len+4);
      this.wfs.trigger(Event.H264_DATA_PARSING, {data: copy});
      //var copy2 = new Uint8Array(0);
      //this.wfs.trigger(Event.H264_DATA_PARSING, {data: copy2});
      //this.wfs.trigger(Event.H264_DATA_PARSING, {data: copy2});
      newBuffer = newBuffer.subarray(len+4);
      offset  += (len+4);
      len = lenView.getUint32(offset);
      //get len
    }
    if(len === newBuffer.byteLength - 4){
      var copy = newBuffer.subarray(4,len+4);
      this.wfs.trigger(Event.H264_DATA_PARSING,{data:copy});
      //var copy2 = new Uint8Array(0);
      //this.wfs.trigger(Event.H264_DATA_PARSING,{data:copy2});
      //this.wfs.trigger(Event.H264_DATA_PARSING,{data:copy2});
      this.buf = null;
    }
    else
      this.buf = new Uint8Array(newBuffer);
/*
    this.buf = new Uint8Array(event.data, 4);
    //this.buf = new Uint8Array(event.data);
    var buf_crc = new Uint8Array(event.data, 0, 4);
    var copy = new Uint8Array(this.buf);  
    
    if (this.mediaType ==='FMp4'){
      this.wfs.trigger(Event.WEBSOCKET_ATTACHED, {payload: copy });
    } 
    if (this.mediaType === 'H264Raw'){
      console.log(copy.length);
      var crc16 = crc.crc16;
      var crc32 = crc.crc32;
      var crc_s = crc16(copy);
      var buf_crc_s =  (buf_crc.map(String.fromCharCode)).join("");
      if(String.fromCharCode(buf_crc[0]) == crc_s[0] &&
	 String.fromCharCode(buf_crc[1]) == crc_s[1] &&
	 String.fromCharCode(buf_crc[2]) == crc_s[2] &&
	 String.fromCharCode(buf_crc[3]) == crc_s[3]){
	//		console.log("equal");	
      }
      else
	console.log("not equal");
     // console.log(crc_s);
      this.wfs.trigger(Event.H264_DATA_PARSING, {data: copy });
    }
*/   
  }

  onWebsocketDataUploading( event ){
    this.client.send( event.data );
  }
  
  onWebsocketMessageSending( event ){  
    this.client.send( JSON.stringify({ t: event.commandType, c:event.channelName, v: event.commandValue  }) );
  }

}

export default WebsocketLoader;  
