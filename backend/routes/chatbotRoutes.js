const express = require('express');
const { askGemini } = require('../controllers/chatbot.controller');
const router = express.Router();

router.post('/chat', askGemini);

module.exports = router;