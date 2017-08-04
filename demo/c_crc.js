'use strict';

var crc16 = require('js-crc').crc16;
var fs = require('fs');
var readLine = require('lei-stream').readLine;
var writeLine = require('lei-stream').writeLine;

var fd = fs.openSync('car.h264', 'r');
var offset = 0;
var inputFile = './car.txt';
var outputFile = './crc.txt';

var output = writeLine(outputFile);

readLine(inputFile).go(function(data,next){
	var frame_size = parseInt(data);
	var buf = new Buffer(frame_size);
	fs.readSync(fd,buf,0,buf.length,offset);
	offset += frame_size;
	var crc_str = crc16(buf);
	output.write(crc_str);
	next();
}, function(){
	console.log('end');
});
