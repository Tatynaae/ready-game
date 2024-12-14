const express = require('express');

const app = express();

const http = require('http').Server(app);
// const cors = require('cors');

const socketIO = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:5173',
    }
});

let users = [];
let readyList = [];

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World!'
    });
});

socketIO.on('connection', (socket) => {
    console.log(`${socket.id} user connected`);

    socket.on('joinGame', (nickname) => {
        if (!nickname) {
            console.warn('Nickname is required to join the game.');
            return;
        }
        users.push({ id: socket.id, nickname, ready: false });
        console.log(`${nickname} joined the game`);
        socketIO.emit('updateUsers', users);
    });


    socketIO.on('startGame', () => {
        console.log('Game started by admin');
        socketIO.emit('gameStarted');
    })

    socket.on('userReady', ({ id, timestamp }) => {
        if (!readyList.some((entry) => entry.id === id)) {
            readyList.push({ id, timestamp });
            readyList.sort((a, b) => a.timestamp - b.timestamp);
        }
        console.log('User ready list updated:', readyList);
        const orderedList = readyList.map((entry) => users.find((u) => u.id === entry.id));
        socketIO.emit('readyList', orderedList);
    });
    

    socketIO.on('disconnect', () => {
        users = users.filter((user) => user.id !== socket.id);
        readyList = readyList.filter((user) => user.id !== socket.id);
        console.log(`${socket.id} user disconnected`);
        socketIO.emit('updateUsers', users);
    })
});

http.listen(8383, () => console.log('Listening on port 8383'));