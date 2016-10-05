$(document).ready(function(){
	FA = FA || {};
});

var userName = localStorage.userName;
if(userName === undefined)
{
      console.log(userName === undefined);
      window.location.href = "http://localhost:3000/";
}

var socket = io();
$(document).ready(function(){
      $("#one").focus();
});

$(document).on("change", "input", function(e){
      socket.emit('editing-field', {
            userName : userName,
            field: $(this).attr("name")
      });
});

socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
});

socket.on('edit-notification', function(notification){
    $('#messages').append($('<li>').text(notification.msg));
});