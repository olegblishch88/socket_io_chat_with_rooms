const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MessageSchema = new Schema({
    text: {
        type: String,
        require: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'chat',
        required: true
    }
});

module.exports = mongoose.model('message', MessageSchema);