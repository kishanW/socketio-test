var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
users = [];

http.listen(3000, function(){
  console.log('listening on *:3000');
});


//routing
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.htm');
});



//sockets
io.on('connection', function(socket){
  //console.log('a user connected');

  //disconnected
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  //new users
  socket.on('new-user', function(userName){
    console.log("\n regestering user: " + userName);

    users[users.length] = userName;
    io.emit('new-user-notification', {
      newuser: socket.userName,
      count: users.length
    });

    console.log("\n"+ userName + " joined the page. We have total of " + users.length + " users in this page now.");
  });

  socket.on('field-edit', function(editMessage){
    var field = editMessage.field;
    var userName = editMessage.userName;

    var notification = {
      field: field,
      msg: userName + " is editing the " + field
    };
    socket.broadcast.emit('edit-notification', notification);
  });

});