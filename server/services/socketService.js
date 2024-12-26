const { joinGame, userReady, handleDisconnect } = require('../controllers/userController');
const { startGame, endGame } = require('../controllers/gameController');

const users = [];
const readyList = [];

const initialize = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: '*',
            allowedHeaders: ['Content-Type'],
        },
    });

    io.on('connection', (socket) => {
        console.log(`${socket.id} user connected`);

        socket.on('joinGame', (nickname) => joinGame(socket, io, nickname));
        socket.on('startGame', () => startGame(socket, io));
        socket.on('userReady', (payload) => userReady(socket, io, payload));
        socket.on('endGame', () => endGame(socket, io));
        socket.on('disconnect', () => handleDisconnect(socket, io));
    });
}

module.exports = { initialize, users, readyList };