这个库来自于：https://github.com/ChihChengYang/wfs.js
根据自己的项目需求，改进了几个地方：
1. 为了低延时，去掉了缓存（解决延时问题）
2. 设置mvhd.duration = 0， 开启浏览器解码的低延时模式（解决延时问题）
3. 对websocket收到的数据进行帧解析，确保提交给remux的数据是完整的一帧（解决花屏问题）
4. index.html 添加了rotate180，解决了倒置问题。
5。详情参考 http://www.cnblogs.com/programmer-wfq/p/7281894.html

================ 
wfs.js - html5 player for raw h.264 streams. 
================
 
 A javascript library which implements websocket client for watching and focusing on raw h.264 live streams in your browser that works directly on top of a standard HTML5 element and MediaSource Extensions. 
 
 It works by transmuxing H264 NAL unit into ISO BMFF (MP4) fragments.

 Also,Implement a demo server to push video streams.   
 
##  Build
git clone https://github.com/ChihChengYang/wfs.js.git

**wfs.js**  

1. setup node.js/npm dev environement  

2. cd wfs.js  

3. npm install  

4. npm run build  

 
**demo server**  

Setup go's dev environement  

go get "github.com/gorilla/websocket"  
  
go get "github.com/satori/go.uuid"  

./server/build_lite.sh  


Demo server serves with raw h.264 files,
yet that can be easily transfered and connected to RTSP or other sources (h.264 streaming).

##  Demo
1. run ./demo/wfs_server  

2. open a browser e.g. Chrome , 127.0.0.1:8888  

##  Reference

[hls.js](https://github.com/dailymotion/hls.js "hls.js")

	
	


 
