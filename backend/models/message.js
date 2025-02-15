const { getDb } = require('../config/db');

// Save a message to MongoDB
const saveMessage = async (from, to, message) => {
  try {
    const db = getDb();
    const collection = db.collection('messages');
    const newMessage = {
      from,
      to,
      message,
      timestamp: new Date(),
    };

    await collection.insertOne(newMessage);
    console.log('Message saved to database');
  } catch (error) {
    console.error('Error saving message:', error);
  }
};

// Get chat history between two users
const getMessages = async (user1, user2) => {
  try {
    const db = getDb();
    const collection = db.collection('messages');
    const messages = await collection
      .find({
        $or: [
          { from: user1, to: user2 },
          { from: user2, to: user1 },
        ],
      })
      .sort({ timestamp: 1 }) // Sorting messages by timestamp in ascending order
      .toArray();

    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

module.exports = { saveMessage, getMessages };
