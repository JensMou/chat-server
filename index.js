let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () { console.log('mongodb connected!') });

io.on('connection', (socket) => {

  socket.on('disconnect', function () {
    io.emit('users-changed', { user: socket.nickname, event: 'left' });
  });

  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    io.emit('users-changed', { user: nickname, event: 'joined' });
  });

  socket.on('add-message', (data) => {
    var message = new message({
      text: message.text,
      from: socket.nickname,
      created: new Date()
    });
    io.emit('message', message);

    message.save(function (error) {
      if (error) {
        console.error(error);
      }
    });
  });

});
var port = process.env.PORT || 3001;

http.listen(port, function () {
  console.log('listening in http://localhost:' + port);
});
