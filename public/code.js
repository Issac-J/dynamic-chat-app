// Getting Elements
const appEl = document.querySelector(".app");
const joinUserBtn = document.querySelector("#join-user");
const userNameEl = document.querySelector(".join-screen #username");
const joinScreenEl = document.querySelector(".join-screen");
const chatScreenEl = document.querySelector(".chat-screen");
const messageInputEl = document.querySelector("#message-input");
const messageSendBtn = document.querySelector("#send-message");
const messagesEl = document.querySelector(".messages");
const exitBtn = document.querySelector("#exit-chat");

// Variables
const socket = io();

let uName = "";

// Events       ****************************************

// Join User
joinUserBtn.addEventListener("click", () => {
  let username = userNameEl.value;

  if (username.length == 0) {
    return;
  }
  socket.emit("newuser", username);
  uName = username;
  joinScreenEl.classList.remove("active");
  chatScreenEl.classList.add("active");
});

// Send Message
messageSendBtn.addEventListener("click", () => {
  let message = messageInputEl.value;

  if (message.length == 0) return;

  renderMessage("my", {
    username: uName,
    text: message,
  });

  socket.emit("chat", {
    username: uName,
    text: message,
  });

  // messageInputEl 초기화
  messageInputEl.value = "";
});

// Press exitButton
exitBtn.addEventListener("click", () => {
  socket.emit("exituser", uName);

  window.location.href = window.location.href;
});

socket.on("update", (update) => {
  renderMessage("update", update);
});

socket.on("chat", (message) => {
  renderMessage("other", message);
});

// Functions     ****************************************
function renderMessage(type, message) {
  let messageContainer = messagesEl;

  if (type == "my") {
    let el = document.createElement("div");
    el.setAttribute("class", "message my-message");
    el.innerHTML = `
        <div>
            <div class="name">You</div>
            <div class="text">${message.text}</div>
        </div>
    `;

    messageContainer.appendChild(el);
  }
  // 다른 사람이 보낸 메세지 Render
  else if (type == "other") {
    let el = document.createElement("div");
    el.setAttribute("class", "message other-message");
    el.innerHTML = `
        <div>
            <div class="name">${message.username}</div>
            <div class="text">${message.text}</div>
        </div>
    `;

    messageContainer.appendChild(el);
  } else if (type == "update") {
    let el = document.createElement("div");
    el.setAttribute("class", "update");
    el.innerText = message;

    messageContainer.appendChild(el);
  }

  messageContainer.scrollTop =
    messageContainer.scrollHeight - messageContainer.clientHeight;
}
