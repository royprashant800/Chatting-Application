const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

// Audio that will play on receiving messages
var audio = new Audio('ping.mp3');

// Function which will append event info to the container
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left'){ 
        audio.play();
    }
}

// Ask new user for his/her Name and let the server know
const Name = prompt("Enter your Name to join");
socket.emit('new-user-joined', Name);

// If a new user joins, receive his/her Name from the server
socket.on('user-joined', Name =>{
    append(`${Name} joined the chat`, 'right')
})

// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.Name}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('left', Name =>{
    append(`${Name} left the chat`, 'right')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})