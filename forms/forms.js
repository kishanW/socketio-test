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
      //broadcast list on connection
      BroadcastUserList();

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

            BroadcastUserList();

            console.log("\n"+ userName + " joined the page. We have total of " + users.length + " users in this page now.");
      });


      socket.on("remove-user", function(userName){
            var userIndex = users.indexOf(userName);
            if(userIndex !== -1)
            {
                  users.splice(userIndex, 1);
                  BroadcastUserList();
            }
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

      socket.on("field-focus-in", function(data){
            console.log(data.username  + " focus-in at " + data.field);
            socket.broadcast.emit("field-notification", {
                  event: "focus in",
                  data: data
            });
      });

      socket.on("field-focus-out", function(data){
            console.log(data.username  + " focus-out at " + data.field);
            socket.broadcast.emit("field-notification", {
                  event: "focus out",
                  data: data
            });
      });

      socket.on("field-change", function(data){
            console.log(data.username  + " value-change at " + data.field);
            socket.broadcast.emit("field-notification", {
                  event: "change",
                  data: data
            });
      });

      function BroadcastUserList(){
            io.emit("user-list-update", users);
      };


});
