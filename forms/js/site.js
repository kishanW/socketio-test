var FA = {};
var socket = io();
var storage = {};

/*    REGULAR EVENTS
*******************************************************************************/
$(document).ready(function(){
  window.body = $("body");
  $("#username").val("").focus();

  if(localStorage.userName)
  {
    storage = localStorage;
    FA.ToggleLogoutScreen(true);
    FA.AddNewUser();
    console.log("automatic log in initiated.");

    $(".page-title").text("Hi " + storage.userName + ", this is your form.");
  }
});

$(document).on("click", "#loginButton", function(){
  FA.SetupStorage();
  storage.userName = $("#login-form #username").val();
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

$(document).on("keypress", "input[type=text]:not(#username)", function(){
  FA.FieldChangeNotification($(this));
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

socket.on("field-notification", function(notification){
  console.log(notification.data.username + " is " + notification.event + " at " + notification.data.field);

  var field = $("[name="+ notification.data.field+"]");
  var fieldUsers = field.parent().find(".field-users");

  if(field && notification.event === "focus in")
  {
    field.addClass("edit-mode");
    var newUser = $("<li data-user='" + notification.data.username + "'>" + notification.data.username + "</li>");
    fieldUsers.prepend(newUser);
  }
  else if(field && notification.event === "change")
  {
    //we need to fix this
    field.addClass("change");
    field.prop("readonly", "");
    var oldUser = fieldUsers.find("[data-user='" + notification.data.username + "']");
    oldUser.slideUp(function(){
      $(this).remove();
    });
  }
  else if(field && notification.event === "focus out")
  {
    field.removeClass("edit-mode").removeClass("change");
    field.removeProp("readonly");
    var oldUser = fieldUsers.find("[data-user='" + notification.data.username + "']");
    oldUser.slideUp(function(){
      $(this).remove();
    });
  }
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
  //storage.userName = $("#login-form #username").val();
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

FA.FieldChangeNotification = function(field){
  socket.emit("field-change", {
    field: field.prop("name"),
    username: storage.userName
  });
};
