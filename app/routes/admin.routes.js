const express = require('express');

const router = express.Router();

const messages = require('../controllers/message.controller.js');
const categories = require('../controllers/category.controller.js');

const auth = require('../../services/auth.js');

// Create a new Message
router.post('/messages', messages.create);
// Update a Message with messageId
router.put('/messages/:messageId', messages.update);
// Delete a Message with messageId
router.delete('/messages/:messageId', messages.delete);

// Create a new Category
router.post('/categories', categories.create);
// Update a Category with categoryId
router.put('/categories/:categoryId', categories.update);
// Delete a Category with categoryId
router.delete('/categories/:categoryId', categories.delete);

    
module.exports = router;