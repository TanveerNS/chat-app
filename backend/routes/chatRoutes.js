const express = require('express');
const { saveMessage, getMessages } = require('../controllers/chatController');
const sendResponse = require('../utils/response');

const router = express.Router();

router.get('/messages', async (req, res) => {
  try {
    const messages = await getMessages();
    sendResponse(res, 200, 'Messages fetched successfully', messages);
  } catch (error) {
    sendResponse(res, 500, 'Error fetching messages');
  }
});

router.post('/messages', async (req, res) => {
  const { user, message } = req.body;
  try {
    await saveMessage(user, message);
    sendResponse(res, 200, 'Message saved successfully');
  } catch (error) {
    sendResponse(res, 500, 'Error saving message');
  }
});

module.exports = router;
