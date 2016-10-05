var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use("/css", express.static(__dirname + '/css'));
app.users = [];

http.listen(3000, function(){
  console.log('listening on *:3000');
});


//routing
app.get('/', function(req, res){
  res.sendFile(__dirname + '/../index.htm');
});



//sockets
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  }); 

  socket.on('new user', function(userName){
    app.users[app.users.length] = userName;
    io.emit('chat message', userName + " joined. Now we have " + app.users.length + " onilne.");
  });

  socket.on('editing-field', function(editMessage){
    var field = editMessage.field;
    var userName = editMessage.userName;

    var notification = {
      field: field,
      msg: userName + " is editing the " + field
    };
    socket.broadcast.emit('edit-notification', notification);
  });

});