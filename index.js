var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use("/css", express.static(__dirname + '/css'));
app.users = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/login.htm');
});

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/chat.htm');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    var message = msg.userName + " says: " + msg.message;
    io.emit('chat message', message);
  });

  socket.on('new user', function(userName){
    app.users[app.users.length] = userName;
    io.emit('chat message', userName + " joined. Now we have " + app.users.length + " onilne.");
  });

});