const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { registerUser, getFriendList, addFriend } = require('./models/User');
const { saveMessage, getMessages } = require('./models/message');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
connectDB()
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

let users = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('register', async (username) => {
    users[username] = socket.id;
    await registerUser(username); 
    console.log(`User ${username} registered with socket ID: ${socket.id}`);

    const friends = await getFriendList(username);
    io.to(socket.id).emit('friendList', friends);
  });

  socket.on('addFriend', async (data) => {
    const { username, friend } = data;
    await addFriend(username, friend);
    
    const updatedFriends = await getFriendList(username);
    const friendSocketId = users[friend];
    if (friendSocketId) {
      io.to(friendSocketId).emit('friendList', updatedFriends);
    }
    
    io.to(users[username]).emit('friendList', updatedFriends);
    console.log(`Friend ${friend} added to ${username}`);
  });

  socket.on('sendMessage', async (data) => {
    const { from, to, message } = data;
    await saveMessage(from, to, message);

    const receiverSocketId = users[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', { from, message });
    }

    const senderSocketId = users[from];
    if (senderSocketId) {
      io.to(senderSocketId).emit('receiveMessage', { from, message });
    }
  });

  socket.on('getMessageHistory', async (data) => {
    const { user1, user2 } = data;
    const messages = await getMessages(user1, user2);
    io.to(users[user1]).emit('messageHistory', messages);
    io.to(users[user2]).emit('messageHistory', messages);
  });

  socket.on('disconnect', () => {
    for (const [username, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[username];
        console.log(`User ${username} disconnected`);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
