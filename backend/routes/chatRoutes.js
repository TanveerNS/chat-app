const express = require('express');
const { saveMessage, getMessages } = require('../controllers/chatController');
const sendResponse = require('../utils/response');

const router = express.Router();

// Route to get all chat messages (GET request)
router.get('/messages', async (req, res) => {
  try {
    const messages = await getMessages();
    sendResponse(res, 200, 'Messages fetched successfully', messages);
  } catch (error) {
    sendResponse(res, 500, 'Error fetching messages');
  }
});

// Route to send a new message (POST request)
router.post('/messages', async (req, res) => {
  const { user, message } = req.body;
  try {
    // Save the message
    await saveMessage(user, message);
    sendResponse(res, 200, 'Message saved successfully');
  } catch (error) {
    sendResponse(res, 500, 'Error saving message');
  }
});

module.exports = router;
