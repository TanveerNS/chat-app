const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { registerUser, getFriendList, addFriend } = require('./models/User');
const { saveMessage, getMessages } = require('./models/Message');
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

// Store users and their socket IDs
let users = {}; // Maps usernames to socket IDs

// Socket.IO Connection event
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('register', async (username) => {
    users[username] = socket.id;
    await registerUser(username); // Register the user in the database
    console.log(`User ${username} registered with socket ID: ${socket.id}`);

    // Send the user's friend list
    const friends = await getFriendList(username);
    io.to(socket.id).emit('friendList', friends);
  });

  // Add a friend to the user's friend list
  socket.on('addFriend', async (data) => {
    const { username, friend } = data;
    await addFriend(username, friend);
    
    // Update both users' friend lists
    const updatedFriends = await getFriendList(username);
    const friendSocketId = users[friend];
    if (friendSocketId) {
      io.to(friendSocketId).emit('friendList', updatedFriends);
    }
    
    io.to(users[username]).emit('friendList', updatedFriends);
    console.log(`Friend ${friend} added to ${username}`);
  });

  // Handle sending a message
  socket.on('sendMessage', async (data) => {
    const { from, to, message } = data;
    await saveMessage(from, to, message);

    // Send the message to the other user
    const receiverSocketId = users[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receiveMessage', { from, message });
    }

    const senderSocketId = users[from];
    if (senderSocketId) {
      io.to(senderSocketId).emit('receiveMessage', { from, message });
    }
  });

  // Fetch message history when user connects or selects a friend
  socket.on('getMessageHistory', async (data) => {
    const { user1, user2 } = data;
    const messages = await getMessages(user1, user2);
    io.to(users[user1]).emit('messageHistory', messages);
    io.to(users[user2]).emit('messageHistory', messages);
  });

  // Handle user disconnect
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

// Set the server to listen on a port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
