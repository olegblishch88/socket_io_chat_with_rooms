let socket = io();

let messageInput = document.getElementById('message-input');
let messageBtn = document.getElementById('message-btn');
let messages = document.getElementById('messages');

messageBtn.onclick = function(){
    let text = messageInput.value;
    messageInput.value = '';

    socket.emit('message', {text});
}

socket.on('message', function(msg){
    addMsg(msg);
});
socket.on('init', function(messages){
    for(let message of messages){
        addMsg(message);
    }
});

socket.on('alert', function(alert){
    console.log(alert);
});


function addMsg(msg){
    let singleMessage = document.createElement('div');
    singleMessage.classList.add('message');
    singleMessage.innerText = `${msg.data} ${msg.author} ${msg.text}`;
    messages.appendChild(singleMessage);
}