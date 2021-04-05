

let hostIP = new String(window.hostIP);
if (hostIP.startsWith("ws")){
    // already formatted
}else if (hostIP.indexOf(".") == -1 && !hostIP.startsWith("localhost")){
    // Just the port:
    let full = new URL(location.href);
    let domain = full.hostname;
    console.log(domain);

    hostIP = "ws:"+domain+":"+hostIP;

}else{
    // Just the domain and port
    hostIP = "ws://"+hostIP;
}

console.log("Connecting to: ", hostIP);

// Create a new yodel socket connected to the local API server
let yodelSocket = new yodel.YodelSocket(hostIP);


// Collect some HTML elements:
let messageList = document.getElementById("MessageList");
let textBox = document.getElementById("MessageBox");
let submit = document.getElementById("submit");
let nameBox = document.getElementById("NameBox");
let pinger = document.getElementById("pinger");


let lastMessageId = "p"+Math.random();


// Sloppy and quick way to add a message to the list
function addMessage(name, message){
    messageList.innerHTML += "<li class='uk-padding-small uk-width-1-1 uk-background-primary' style='border-radius:25px;'><p class='uk-text'><b>"+
    name+"</b>:\t"+
    message+
    "</p></li>";
}

// Setup the yodel socket
function setup(){
    yodelSocket.channel = 8;
    yodelSocket.name = "YodelTest";
    yodelSocket.joinGroup("a");
    setInterval(()=>{
        if(yodelSocket){
            
            lastMessageId = "p"+Math.random();
            yodelSocket.send(lastMessageId);
            
        }
    }, 1000);

}

function rping(){
    pinger.style = "color: green;";
    setTimeout(()=>{pinger.style = "color: red;"}, 200);
}


// Receive a message from the yodel socket
function receiver(section){
    if(section.name != undefined){
        addMessage(section.fields.name, section.fields.message);
    }else {
        rping();
    }
}

// Add a local message to the board, and send it out through yodel
function localMessageAdder(){
    if (textBox.value != ""){
        // Add the message locally using 'Me' as the username of the poster
        //addMessage("Me",textBox.value);
        
        // Send the message and my name through the yodel socket
        yodelSocket.send({
            name: nameBox.value,
            message: textBox.value
        }, "", "a");
        
        // Reset the textbox
        textBox.value = ""
    }
}



// Apply events
submit.onclick = localMessageAdder;
yodelSocket.setOnConnect(setup);
yodelSocket.setOnMessage(receiver);


