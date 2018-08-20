module.exports = (app) => {
    var cors = require('cors')
    
    app.use(cors())
    
    const messages = require('../controllers/message.controller.js');

    // Retrieve all messages
    app.get('/messages', messages.findAll);

    // Retrieve a single Message with messageId
    app.get('/messages/:messageId', messages.findOne);

}