const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const connectDB = require('./config/dbConfig');

const Chat = require('./models/chat')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {

    socket.on('join_room', (data) => {
        socket.join(data.roomid);
    });


    socket.on('msg_send', async(data) => {
        console.log(data);
        const chat = await Chat.create({
            roomId: data.roomId,
            user: data.username,
            content: data.msg,
        })
        // io.emit('msg_rcvd', data);
        io.to(data.roomid).emit('msg_rcvd', data);
    })


});

app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public')) // this middlewere maps that where is the public folder is located

app.get('/chat/:roomid', async(req,res) => {
    const chats = await Chat.find({
        roomId: req.params.roomid
    }).select('content user')
    res.render('index', {
        name: "Harshit",
        id: req.params.roomid,
        chats: chats,
    })

})


server.listen(3001, async() => {
    console.log("Server started on port 3001");
    await connectDB();
})