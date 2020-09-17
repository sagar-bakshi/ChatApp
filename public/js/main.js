
const formData = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and rooms from url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});


const socket = io();


//Join Chat
socket.emit('joinRoom',{username,room});

//get room and users
socket.on('roomUsers',({room, users})=>{
    outputRoomName(room);
    outUsers(users);
});

//message from server
socket.on('message', message =>{
    //sending messge to the DOM
    outputMessage(message);

    //Scrolling function
    chatMessage.scrollTop = chatMessage.scrollHeight;
});


//message submit
formData.addEventListener('submit',(e)=>{
   e.preventDefault();

   //getting the data from form
   const msg = e.target.elements.msg.value;

    //sending msg to server
    socket.emit('chatMessage',msg);

    //clearing the input section after sending message
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();

});

//output message to DOM

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span> ${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    // const div = document.createElement('div');
    // div.classList.add('message');
    // div.innerHTML=` <p class="meta">${message.username} <span>${message.time}</span></p>
    //             <p class="text">
    //                 ${message.text}
    //             </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//outout for user and rooms
//adding room name

function outputRoomName(room) {
    roomName.innerText=room;
}

//adding users to dom
function outUsers(users){
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}
