const TikTokLiveConnection = require('tiktok-live-connector').default;
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const tiktokUsername = "kingofhell529";

const tiktokConnection = new TikTokLiveConnection(tiktokUsername);

server.listen(3000, () => {
  console.log("Backend running at http://localhost:3000");
});

app.use(express.static("public"));

io.on('connection', (socket) => {
  console.log("Game connected!");

  tiktokConnection.on("gift", data => {
    const giftName = data.giftName.toLowerCase();
    let hpChange = 0;

    switch (giftName) {
      case "rose":
        hpChange = 5;
        break;
      case "gg":
        hpChange = -5;
        break;
      case "ice cream cone":
        hpChange = 2;
        break;
      case "heart me":
        hpChange = -2;
        break;
    }

    if (hpChange !== 0) {
      socket.emit("giftEvent", {
        type: "gift",
        name: giftName,
        change: hpChange
      });
    }
  });

  tiktokConnection.on("chat", msg => {
    let text = msg.comment.trim();
    let hpChange = 0;

    if (text === "1") hpChange = 1;
    else if (text === "2") hpChange = -2;

    if (hpChange !== 0) {
      socket.emit("giftEvent", {
        type: "comment",
        name: text,
        change: hpChange
      });
    }
  });
});

tiktokConnection.connect().catch(err => {
  console.error("Connection error:", err);
});
