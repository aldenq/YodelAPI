
// Create a new yodel socket connected to the local API server
let yodelSocket = new yodel.YodelSocket("ws://192.168.1.78:5561/", "YodelTest");


// Collect some HTML elements:
let messageList = document.getElementById("MessageList");
let textBox = document.getElementById("MessageBox");
let submit = document.getElementById("submit");
let nameBox = document.getElementById("NameBox");


// Sloppy and quick way to add a message to the list
function addMessage(name, message){
    messageList.innerHTML += "<li class='uk-padding-small uk-width-1-1'><p class='uk-text'><b>"+
    name+"</b>:\t"+
    message+
    "</p></li>";
}

// Setup the yodel socket
function setup(){
    yodelSocket.channel = 8;
    yodelSocket.name = "YodelTest";
    yodelSocket.joinGroup("a");
}

// Receive a message from the yodel socket
function receiver(section){
    addMessage(section.fields.name, section.fields.message);
}

// Add a local message to the board, and send it out through yodel
function localMessageAdder(){
    if (textBox.value != ""){
        // Add the message locally using 'Me' as the username of the poster
        addMessage("Me",textBox.value);
        
        // Send the message and my name through the yodel socket
        yodelSocket.send({
            name: nameBox.value,
            message: textBox.value
        }, "YodelEcho", "b");
        
        // Reset the textbox
        textBox.value = ""
    }
}

// Apply events
submit.onclick = localMessageAdder;
yodelSocket.setOnConnect(setup);
yodelSocket.setOnMessage(receiver);


