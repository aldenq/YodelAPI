var socket = new yodel.YodelSocket("ws://localhost:5560", "name");
socket.channel = 5;
var keyboard = new yodel.KeyboardGrabber();
socket.setOnConnect(function(){


socket.name = "YodelTest";
socket.joinGroup("a");

keyboard.sendTo(socket, "YodelEcho", "b");

});

socket.onmessage = function(msg){
    if (yodel.KeyboardGrabber.isEvent(msg.fields)){
        console.log(msg.fields);
        //if(keyboard.isSendingTo(socket, "YodelEcho", "b")){
        //    keyboard.stopSendingTo(socket, "YodelEcho", "b");
        //}
        //socket.send("test", "YodelEcho", "b");
    }
}