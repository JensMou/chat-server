let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let Message = require('./model/message.js');
let ChatRoom = require('./model/chatRoom.js');

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chatServer');
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () { console.log('mongodb connected!') });

io.on('connection', (socket) => {

  socket.on('disconnect', function () {
    io.emit('users-changed', { user: socket.nickname, event: 'left' });
  });

  socket.on('getAllMessages', (data) => {
    Message.find({chatRoom : data.chatRoom}, (error, messages) => {
      io.emit('pushAllMessages', messages);
    });
  });

  socket.on('getAllChatRooms', function(){
    ChatRoom.find({}, (error, chatRooms) => {
      io.emit('pushAllChatRooms', chatRooms)
    });
  });

  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', { user: nickname, event: 'joined' });
  });

  socket.on('set-chatRoomName', (chatRoomName) => {
    socket.chatRoomName = chatRoomName;
  });

  socket.on('add-message', (data) => {
    let message = new Message({
      text: data.text,
      from: socket.nickname,
      created: new Date(),
      chatRoom: data.chatRoom
    });
    message.save();
    io.emit('message', message);
  });

  socket.on('createChatRoom', (data) => {
    var chatRoom = new ChatRoom({
      name: data.name
    });
    chatRoom.save();
    io.emit('chatRoom', chatRoom);
  });

});
var port = process.env.PORT || 3001;


function getAllMessages(){
  Message.find({}, (error, messages) => {
    return messages;
  });
};

function getAllChatRooms(){
  ChatRoom.find({}, (error, chatRooms) => {
    return chatRooms;
  });
};

http.listen(port, function () {
  console.log('listening in http://localhost:' + port);
});