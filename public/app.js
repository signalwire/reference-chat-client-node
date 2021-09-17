function ready(callback) {
  if (document.readyState != 'loading') {
    callback();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading') {
        callback();
      }
    });
  }
}

function handlePresence(uuid, event) {
  console.log('presence', uuid, event)
  if (event == 'joined') {
    if (uuid != UUID) {
      var li = document.createElement('li');
      li.id = 'user_' + uuid;
      li.className = "list-group-item";
      li.innerHTML = uuid;
      var list = document.getElementById("user_list");
      list.appendChild(li);
    }
  } else {
    var li = document.getElementById("user_" + uuid);
    li.parentNode.removeChild(li);
  }
}

function loadHistory(response) {
  response.history.forEach(function(msg){
    renderMessage(msg)
  })
}

function renderMessage(msg) {
  var container = document.getElementById('window_main');
  if (container) {
    var msgBox = document.createElement('div');
    msgBox.className = "row w-100";
    var msgName = document.createElement('div');
    msgName.className = "fw-bold";
    msgName.innerText = msg.sender.uuid;
    var msgText = document.createElement('div');
    msgText.className = "p-0";
    if (msg.payload.text) {
      msgText.innerText = msg.payload.text;
    } else {
      msgText.innerText = msg.payload;
    }
    
    msgBox.appendChild(msgName);
    msgBox.appendChild(msgText);
    container.appendChild(msgBox);
  }
}

function sendMessage(text) {
  _chat.sendMessage(ROOM_NAME, {text})
}

var _chat = null;

ready(async function() {
  _chat = new SignalWireChat({token: TOKEN, domain: DOMAIN});

  _chat.onConnect = function(){
    _chat.subscribe(ROOM_NAME, (response) => {
      _chat.getHistory(ROOM_NAME, (response) => {
        console.log(response)
        loadHistory(response);
      });

      _chat.getPresence(ROOM_NAME, (response) => {
        console.log(response)
        response.presence.forEach(function(user){
          handlePresence(user.uuid, 'joined')
        });
      });
    });
  }

  _chat.onMessage = function(msg){
    console.log('ROOM MSG', msg);
    renderMessage(msg);
  }

  _chat.onPresence = function(msg){
    console.log('presence', msg)
    handlePresence(msg.uuid, msg.event);
  }

  document.getElementById('send').onclick = function(e) {
    var msgBox = document.getElementById('messageBox');
    sendMessage(msgBox.value);
    msgBox.value = '';
  }
});
