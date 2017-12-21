let mongoose = require('mongoose');
let schema = mongoose.Schema;

let chatRoomSchema = schema({
    name : String
});

module.exports = mongoose.model('chatRoom', chatRoomSchema);