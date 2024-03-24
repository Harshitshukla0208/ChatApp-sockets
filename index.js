const express = require("express");
const http = require("http");
const socketio = require("socket.io")

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('msg_send', (data) => {
        console.log(data);
        io.emit('msg_rcvd', data);
    })
});

app.use('/', express.static(__dirname + '/public')) // this middlewere maps that where is the public folder is located

server.listen(3001, () => {
    console.log("Server started on port 3001")
})