var socket = new yodel.YodelSocket("ws://localhost:5560", "name");
socket.channel = 5;
socket.setOnConnect(function(){


socket.name = "YodelTest";
socket.joinGroup("a");



let formater = new yodel.Format([new yodel.Field("stringval", yodel.FieldType.str, bytes=100)], 5);

let sect = new yodel.Section(formater, {"stringval":"teststring"});

socket.send(sect, name="YodelEcho", group="b");






});

socket.onmessage = function(msg){

    console.log(msg);
    console.log(msg.stringval);
    console.log(msg.payload);

}