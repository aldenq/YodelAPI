
var socket = new yodel.YodelSocket("ws://localhost:5560", "name");
socket.setOnConnect(function(){
    
socket.channel = 5;
socket.name = "YodelTest";
socket.joinGroup("a");



socket.onmessage = function(msg){

}
var audio = new yodel.AudioGrabber();
audio.sendTo(socket, "YodelEcho", "b");
});



function test(event){
}

