var FA = {};
var socket = io();
var storage = {};

$(document).ready(function(){  
  window.body = $("body");
});

$(document).on("click", "#login-form button", function(){

  var isPersistentRequested = $("#rememberme").prop("checked");
  if(isPersistentRequested === true)
  {
    storage = localStorage;
  }
  else
  {
    storage = socket;
  }

  storage.userName = $("#login-form #username").val();
  
  FA.UpdateUserAuthentication();
  FA.AddNewUser();
});

/*$(document).on("change", "input", function(e){
      socket.us
      socket.emit('editing-field', {
            userName : userName,
            field: $(this).attr("name")
      });
});*/

socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
});

socket.on('edit-notification', function(notification){
    $('#messages').append($('<li>').text(notification.msg));
});

socket.on("user-list-update", function(users){
  var userlist = $("#userlist").html("");
  for(var i = 0; i < users.length; i++)
  {
    var userItem = $("<li class='list-group-item'>" + users[i] + "</li>");
    userlist.prepend(userItem);
  }

  console.log(users.length + " users online");

  window.body.data().authenticated = users.length> 0;
  if(!window.body.data().authenticated)
  {
    $("#username").focus();
  }

  else if(localStorage.userName)
  {
    storage = localStorage;
  }
  FA.UpdateUserAuthentication();
});


FA.UpdateUserAuthentication = function(){
  var userName = storage.userName;
  var isAuthenticated = (userName !== undefined) && (userName !== null) && (userName !== "null");
  window.body.attr("data-authenticated", isAuthenticated);
};


FA.AddNewUser = function(){
  if(!storage.userName)
  {
    return;
  }

  socket.emit('new-user', storage.userName);
};