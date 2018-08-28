const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema

const MessageSchema = mongoose.Schema({
    title: String,
    content: String,
    date: Date,
    link: {
        type : String,
        required : false
    },
    publishedAt: Date,
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
}, {
    timestamps: true
});

MessageSchema.index( {date: 1} );

MessageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Message', MessageSchema);