let users = [];
let readyList = [];

const initialize = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: '*',
            allowedHeaders: ['Content-Type'],
        },
        transports: ['websocket'],
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

const joinGame = (socket, io, nickname) => {
    if (!nickname) return console.warn('Nickname is required to join the game.');

    const user = users.find(user => user.id === socket.id);
    if (user) return;

    const data = { id: socket.id, nickname, ready: false };
    users.push(data);
    console.log(`${nickname} joined the game`);
    io.emit('updateUsers', users);
    console.log(users, 'users');
};

const userReady = (socket, io, { id, timestamp }) => {
    if (!id || !timestamp) return console.warn('Invalid user ready payload');

    if (!readyList.some(entry => entry.id === id)) {
        readyList.push({ id, timestamp });
        readyList.sort((a, b) => a.timestamp - b.timestamp);
    }

    const orderedList = readyList.map(entry => users.find(u => u.id === entry.id));
    io.emit('readyList', orderedList);
    console.log('User ready list updated:', readyList);
};

const handleDisconnect = (socket, io) => {
    const updatedUsers = users.filter(user => user.id !== socket.id);
    const updatedReadyList = readyList.filter(entry => entry.id !== socket.id);

    users = updatedUsers; 
    readyList = updatedReadyList;

    console.log(`${socket.id} user disconnected`);
    io.emit('updateUsers', users);
};

const startGame = (socket, io) => {
    const user = users?.find(u => u.id === socket.id);

    if(user?.nickname === 'admin'){
        console.log('Game started by admin');
        io.emit('gameStarted');
        readyList.length = 0;
    } else {
        console.log('Only the admin can start the game');
    }
};

const endGame = (socket, io) => {
    const user = users?.find(u => u.id === socket.id);

    if(user?.nickname === 'admin'){
        console.log('Game ended by admin');
        io.emit('gameEnded');
        users.length = 0;
        readyList.length = 0;
    } else {
        console.log('Only the admin can end the game');
    }
};

module.exports = {
    startGame,
    endGame
};

module.exports = { initialize, users, readyList };