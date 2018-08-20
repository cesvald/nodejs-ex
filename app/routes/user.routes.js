const express = require('express');

const router = express.Router();

const users = require('../controllers/user.controller.js');

router.post('/addMessage', users.addMessage);
router.post('/removeMessage', users.removeMessage);
router.get('/getMessages', users.getMessages);

module.exports = router;