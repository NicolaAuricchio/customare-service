'use strict'

var localVideo = document.querySelector('#localVideo');
var localStream;
var socket = io.connect();
/*
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
  */
socket.on('connect', () => {
  console.log("Connetion enstablished");
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      handleUserMedia(stream);
    })
    .catch(error => {
      handleUserMediaError(error);
    });
});

function handleUserMedia(stream) {
  localStream = stream;
  localVideo.srcObject = stream;
  console.log('Adding local stream.');
  socket.emit('status change', 'got user media');
  //startNextButton.disabled = false;
}

function handleUserMediaError(error) {
  console.log('navigator.mediaDevices.getUserMedia error: ', error);
}

socket.on('join', function(msg){
	console.log(msg);
});