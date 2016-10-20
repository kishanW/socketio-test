var FA = {};
var socket = io();
var storage = {};

/*    REGULAR EVENTS
*******************************************************************************/
$(document).ready(function(){
      window.body = $("body");
      $("#username").val("").focus();
});

$(document).on("click", "#loginButton", function(){
      FA.SetupStorage();
      FA.AddNewUser();
      FA.UpdateUserAuthentication();
});

$(document).on("click", "#logoutButton", function(){
      FA.RemoveUser();
});

$(document).on("focus", "input[type=text]", function(){
      FA.FieldFocusInNotification($(this));
});

$(document).on("blur", "input[type=text]", function(){
      FA.FieldFocusOutNotification($(this));
});

/*    SOCKET EVENTS
*******************************************************************************/
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
});

socket.on("field-focus-notification", function(notification){
      console.log(notification);
      //TODO: create functionality to display this properly
});

/*    UTILITY FUNCTIONS
*******************************************************************************/
FA.SetupStorage = function(){
      var isPersistentRequested = $("#rememberme").prop("checked");
      if(isPersistentRequested === true)
      {
            storage = localStorage;
      }
      else
      {
            storage = socket;
            localStorage.removeItem("userName");
      }
};

FA.UpdateUserAuthentication = function(){
      var userName = storage.userName;
      var isAuthenticated = (userName !== undefined) && (userName !== null) && (userName !== "null");
      FA.ToggleLogoutScreen(isAuthenticated);
};

FA.ToggleLogoutScreen = function(action = false){
      if(action !== undefined)
      {
            window.body.attr("data-authenticated", action);
            if(action === false)
            {
                  $("#username").val("").focus();
            }
      }
      else{
            console.log("Toggle Logout Fails.");
      }
};

FA.AddNewUser = function(){
      storage.userName = $("#login-form #username").val();
      if(!storage.userName)
      {
            return;
      }
      socket.emit('new-user', storage.userName);
};

FA.RemoveUser = function(){
      socket.emit("remove-user", storage.userName);
      if(storage.removeProp)
      {
            storage.removeProp("userName");
      }
      else if(storage.removeItem)
      {
            storage.removeItem("userName");
      }
      else if(storage.userName)
      {
            storage.userName = null;
      }
      FA.ToggleLogoutScreen(false);
};

FA.FieldFocusInNotification = function(field){
      socket.emit("field-focus-in", {
            field: field.prop("name"),
            username: storage.userName
      });
};

FA.FieldFocusOutNotification = function(field){
      socket.emit("field-focus-out", {
            field: field.prop("name"),
            username: storage.userName
      });
};
