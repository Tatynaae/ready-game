const express = require('express');

const app = express();

const http = require('http').Server(app);

const socketIO = require('socket.io')(http, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5173/game', 'https://ready-game.vercel.app', 'https://ready-game.vercel.app/game'], 
        methods: ['GET', 'POST'], 
        allowedHeaders: ['Content-Type'], 
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
        const user = users.find(user => user.id === socket.id)
        if(user){
            return;
        }
        users.push({ id: socket.id, nickname, ready: false });
        console.log(users, 'users');
        console.log(`${nickname} joined the game`);
        socketIO.emit('updateUsers', users);
    });

    socket.on('startGame', () => {
        const user = users.find((user) => user.id === socket.id);
        if (user && user.nickname === 'admin') { 
            console.log('Game started by admin');
            socketIO.emit('gameStarted');
            readyList = [];
        } else {
            console.log('Only the admin can end the game');
        }
    });

    socket.on('userReady', ({ id, timestamp }) => {
        if (!readyList.some((entry) => entry.id === id)) {
            readyList.push({ id, timestamp });
            readyList.sort((a, b) => a.timestamp - b.timestamp);
        }
        console.log('User ready list updated:', readyList);
        const orderedList = readyList.map((entry) => users.find((u) => u.id === entry.id));
        socketIO.emit('readyList', orderedList);
    });

    socket.on('endGame', () => {
        const user = users.find((user) => user.id === socket.id);
        if (user && user.nickname === 'admin') { 
            console.log('Game ended by admin');
            socketIO.emit('gameEnded');
            users = [];
            readyList = [];
        } else {
            console.log('Only the admin can end the game');
        }
    });
    
    

    socketIO.on('disconnect', () => {
        users = users.filter((user) => user.id !== socket.id);
        readyList = readyList.filter((user) => user.id !== socket.id);
        console.log(`${socket.id} user disconnected`);
        socketIO.emit('updateUsers', users);
    })
});

http.listen(8383, () => console.log('Listening on port 8383'));