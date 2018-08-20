const Message = require('../models/message.model.js');

// Create and Save a new Message
exports.create = (req, res) => {
    // Validate request
    if(!req.body.content && !req.body.categoryId) {
        return res.status(400).send({
            message: "Message content can not be empty"
        });
    }

    // Create a Message
    const message = new Message({
        title: req.body.title || "Untitled Message", 
        content: req.body.content || "No text for Message",
        date: req.body.date || "No date for Message",
        link: req.body.link
    });
    
    if(req.body.categoryId) message.categories.push(req.body.categoryId);
    
    // Save Message in the database
    message.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Message."
        });
    });

};

// Retrieve and return all messages from the database.
exports.findAll = (req, res) => {
    const { page, perPage, sort } = req.query;
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const filter = req.query.filter || 'lte';
    let filterQuery = filter == 'gt' ? { date: {$gt: date} } : { date: {$lte: date} };
    if(req.query.categoryId) filterQuery['categories'] = req.query.categoryId
    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(perPage, 10) || 10,
        sort: {date: sort || 'desc'}
    };
        
    Message.paginate(filterQuery, options).then(messages => {
        res.send(messages);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving messages."
        });
    });
};

// Find a single message with a messageId
exports.findOne = (req, res) => {
    Message.findById(req.params.messageId).populate('categories')
    .then(message => {
        if(!message) {
            return res.status(404).send({
                message: "Message not found with id " + req.params.messageId
            });            
        }
        res.send(message);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Message not found with id " + req.params.messageId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving message with id " + req.params.messageId
        });
    });
};

// Update a message identified by the messageId in the request
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Message content can not be empty"
        });
    }

    // Find message and update it with the request body
    Message.findByIdAndUpdate(req.params.messageId, {
        title: req.body.title || "Untitled Message",
        content: req.body.content || "No text for Message",
        date: req.body.date || "No date for Messsage",
        categoryId: req.body.categoryId,
        link: req.body.link
    }, {new: true})
    .then(message => {
        if(!message) {
            return res.status(404).send({
                message: "Message not found with id " + req.params.messageId
            });
        }
        res.send(message);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Message not found with id " + req.params.messageId
            });                
        }
        return res.status(500).send({
            message: "Error updating message with id " + req.params.messageId
        });
    });
};

// Delete a message with the specified messageId in the request
exports.delete = (req, res) => {
    console.log(req.params.messageId)
    Message.findByIdAndRemove(req.params.messageId)
    .then(message => {
        if(!message) {
            return res.status(404).send({
                message: "Message not found with id " + req.params.messageId
            });
        }
        res.send({message: "Message deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Message not found with id " + req.params.messageId
            });                
        }
        return res.status(500).send({
            message: "Could not delete message with id " + req.params.messageId
        });
    });
};