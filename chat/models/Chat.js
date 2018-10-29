const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ChatSchema = new Schema({
    name: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('chat', ChatSchema);