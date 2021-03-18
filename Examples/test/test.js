
var socket = new yodel.YodelSocket("ws://localhost:5561", "name");
socket.setOnConnect(function(){
    
socket.channel = 5;
socket.name = "YodelTest";
socket.joinGroup("a");



socket.onmessage = function(msg){
    
}

});


