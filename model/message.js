let mongoose = require('mongoose');
let schema = mongoose.Schema;

let messageSchema = schema({
    text: String, 
    from: String, 
    created: Date
});

mongoose.model('message', messageSchema);