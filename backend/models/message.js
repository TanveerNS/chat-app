const { getDb } = require('../config/db');

// Function to save a message to the database
const saveMessage = async (from, to, message) => {
  try {
    const db = getDb();
    const messagesCollection = db.collection('messages');
    
    const timestamp = new Date();
    const messageDoc = { from, to, message, timestamp };
    
    await messagesCollection.insertOne(messageDoc);
    console.log('Message saved');
  } catch (err) {
    console.error('Error saving message:', err);
  }
};

// Function to get messages between two users
const getMessages = async (user1, user2) => {
  try {
    const db = getDb();
    const messagesCollection = db.collection('messages');
    
    const messages = await messagesCollection
      .find({
        $or: [
          { from: user1, to: user2 },
          { from: user2, to: user1 },
        ],
      })
      .sort({ timestamp: 1 }) // Sort messages by timestamp
      .toArray();
    
    return messages;
  } catch (err) {
    console.error('Error retrieving messages:', err);
    return [];
  }
};

module.exports = { saveMessage, getMessages };
