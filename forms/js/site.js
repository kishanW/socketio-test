var FA = {};
var socket = io();
var localstorage = localStorage;

$(document).ready(function(){  
  window.body = $("body");
  FA.UpdateUserAuthentication();
});

$(document).on("click", "#login-form button", function(){
  localstorage.userName = $("#login-form #username").val();
  FA.UpdateUserAuthentication();
});

/*$(document).on("change", "input", function(e){
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
  var userName = localstorage.userName;
  var isAuthenticated = (userName !== undefined) && (userName !== null) && (userName !== "null");
  window.body.attr("data-authenticated", isAuthenticated);
}