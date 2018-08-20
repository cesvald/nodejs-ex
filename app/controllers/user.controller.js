const User = require('../models/user.model.js');
const Message = require('../models/message.model.js');

exports.addMessage = (req, res) => {
    if(!req.body.messageId) {
        return res.status(400).send({
            message: "messageId can not be empty"
        });
    }
    User.findById(req.user._id).then( user => {
        Message.findById(req.body.messageId).then( message => {
            user.messages.push(message);
            user.save().then(user => {
                res.send({message: "Message added successfully"});
            }).catch(err => {
                return res.status(500).send({
                    message: "Error adding message with id " + req.body.messageId
                });
            });
        });
    });
}

exports.removeMessage = (req, res) => {
    if(!req.body.messageId) {
        return res.status(400).send({
            message: "messageId can not be empty"
        });
    }
    User.findById(req.user._id).then( user => {
        user.messages.pull(req.body.messageId);
        user.save().then(user => {
            res.send({message: "Mensage removed successfully"});
        }).catch(err => {
            return res.status(500).send({
                message: "Error removing message with id " + req.params.messageId
            });
        });
    });
}

exports.getMessages = (req, res) => {
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
    User.findById(req.user._id).populate('messages').then( user => {
        console.log(user.messages)
        res.send(user);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving messages."
        });
    });
}