const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { saveMessage, getMessages } = require('./models/Message'); // Import Message model

require('dotenv').config();

// Initialize express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Connect to MongoDB
connectDB(); // Connect to MongoDB

// Store users and their socket IDs
let users = {};

// Socket.IO Connection event
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Register user with their socket ID
  socket.on('register', (username) => {
    users[username] = socket.id;
    console.log(`User ${username} registered with socket ID: ${socket.id}`);

    // Retrieve chat history when a user connects
    socket.on('getChatHistory', async (user2) => {
      const messages = await getMessages(username, user2);
      socket.emit('chatHistory', messages);
    });
  });

  // Handle receiving a message
  socket.on('sendMessage', async (data) => {
    const { from, to, message } = data;
    console.log(`Message from ${from} to ${to}: ${message}`);

    // Save message to the database
    await saveMessage(from, to, message);

    // Check if the recipient exists
    if (users[to]) {
      // Send message to the recipient
      io.to(users[to]).emit('receiveMessage', { from, message });
      console.log(`Message sent to ${to}`);
    }

    // Send the message back to the sender (User1) to display in their panel
    if (users[from]) {
      io.to(users[from]).emit('receiveMessage', { from, message });
      console.log(`Message sent back to ${from}`);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    // Remove user from the users object
    for (const [username, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[username];
        console.log(`User ${username} disconnected`);
        break;
      }
    }
  });
});

// Set server to listen on a port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
