const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = 8000;

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  socket.on("newuser", (username) => {
    socket.broadcast.emit("update", username + " joined the conversation");
  });

  socket.on("exituser", (username) => {
    socket.broadcast.emit("update", username + " left the conversation");
  });

  socket.on("chat", (message) => {
    socket.broadcast.emit("chat", message);
  });
});

server.listen(8000, () => {
  console.log(`Server is Listening on PORT: ${PORT}`);
});
