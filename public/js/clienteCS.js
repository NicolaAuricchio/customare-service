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
  console.log("Connection established");
  navigator.mediaDevices.getDisplayMedia({ video: true })
    .then(stream => {
      handleDisplayMedia(stream);
    })
    .catch(error => {
      handleDisplayMediaError(error);
    });
  // navigator.getUserMedia({video: false, audio: true}, handleUserMedia, handleUserMediaError);
  navigator.mediaDevices.getUserMedia({ video: false, audio: true })
    .then(stream => {
      handleUserMedia(stream);
    })
    .catch(error => {
      handleUserMediaError(error)
    });
});

function handleDisplayMedia(stream) {
  localStream = stream;
}

function handleDisplayMediaError(error) {
  console.log('navigator.getDisplayMedia error: ', error);
}

function handleUserMedia(stream) {
  var tracceAudio = stream.getAudioTracks();
  localStream.addTrack(tracceAudio[0]);
  localVideo.srcObject = localStream;
  socket.emit('cliente passa a got user media', '');
  //startNextButton.disabled = false;
}

function handleUserMediaError(error) {
  console.log('navigator.mediaDevices.getUserMedia error: ', error);
}

socket.on('join', function(msg){
	console.log(msg);
});