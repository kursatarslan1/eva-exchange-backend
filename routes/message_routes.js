const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messages_controller');

router.use(express.json());

router.post('/sendMessage', messageController.sendMessage);
router.get('/getMessageHistory', messageController.getAllMessages);
router.get('/getMessages', messageController.getMessagesByUserId);

module.exports = router;
