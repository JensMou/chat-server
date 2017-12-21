let mongoose = require('mongoose');
let schema = mongoose.Schema;

let messageSchema = schema({
    text: String, 
    from: String, 
    created: Date,
    chatRoom: String
});

module.exports = mongoose.model('message', messageSchema);