const { getDb } = require('../config/db');

const saveMessage = async (user, messageText) => {
  try {
    const db = getDb();
    const collection = db.collection('messages');
    const newMessage = {
      user,
      message: messageText,
      timestamp: new Date(),
    };
    await collection.insertOne(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    throw new Error('Error saving message to the database');
  }
};

const getMessages = async () => {
  try {
    const db = getDb();
    const collection = db.collection('messages');
    return await collection.find().sort({ timestamp: 1 }).toArray();
  } catch (error) {
    console.error('Error retrieving messages:', error);
  }
};

module.exports = {
  saveMessage,
  getMessages,
};
