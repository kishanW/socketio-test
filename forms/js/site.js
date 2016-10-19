var FA = {};
var socket = io();
var storage = {};

$(document).ready(function(){  
  window.body = $("body");
  if(!window.body.data().authenticated)
  {
    $("#username").focus();
  }

  if(localStorage.userName)
  {
    storage = localStorage;
  }
  FA.UpdateUserAuthentication();
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