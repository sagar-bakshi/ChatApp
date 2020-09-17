const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');
const formatMessage = require('./util/messages');
const {userjoin, getCurrentUser, userLeave, getRoomUsers } = require('./util/users');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const botName = 'Chat Bot'

//static files
app.use(express.static(path.join(__dirname,'public')));

//port that server is running on
const PORT = process.env.PORT || 4000


//run when client connects
io.on('connection',(socket)=>{
    console.log('client connected');

    //getting the username and rooms from client
    socket.on('joinRoom',({username,room})=>{

        const user = userjoin(socket.id,username,room);

        socket.join(user.room);

        //welcome message
        socket.emit('message', formatMessage(user.username, 'Welcome to Lets Chat!'));

        //broadcast message when user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has join the chat`));

        // Send users and room info
        io.to(user.room).emit('roomUsers',{
           room:user.room,
           users:getRoomUsers(user.room)
        });
    });

    //sending msg back to clients
    socket.on('chatMessage',(msg)=>{

        const user = getCurrentUser(socket.id);
        io.emit('message',formatMessage(user.username,msg));
    });

    //message when user disconnected from chat
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if (user){
            io.to(user.room).emit('message',formatMessage(botName,  `${user.username} has left the chat`));

            // Send users and room info
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            });
        }

    });

});

server.listen(PORT, ()=>{
    console.log('server is running on '+PORT);
});
