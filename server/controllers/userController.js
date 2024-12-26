const users = require('../services/socketService').users;
const readyList = require('../services/socketService').readyList;

const joinGame = (socket, io, nickname) => {
    if(!nickname) return console.warn('Nickname is required to join the game.');

    if(users.find(user => user.id === socket.id)) return;

    users.push({id: socket.id, nickname, ready: false});
    console.log(`${nickname} joined the game`);
    io.emit('updateUsers', users);
};

const userReady = (socket, io, {id, timestamp}) => {
    if(!id || !timestamp) return console.warn('Invalid user ready payload');

    if(!readyList.some(entry => entry.id === id)){
        readyList.push({id, timestamp});
        readyList.sort((a, b) => a.timestamp - b.timestamp);
    }

    const orderedList = readyList.map(entry => users.find(u => u.id === entry.id).filter(Boolean));
    io.emit('readyList', orderedList);
    console.log('User ready list updated:', readyList);
};

const handleDisconnect = (socket, io) => {
    const updatedUsers = users.filter(user => user.id !== socket.id);
    const updatedReadyList = readyList.filter(entry => entry.id !== socket.id);

    users.length = 0;
    users.push(...updatedUsers);

    readyList.length = 0;
    readyList.push(...updatedReadyList);

    console.log(`${socket.id} user disconnected`);
    io.emit('updateUsers', users);
};

module.exports  = {
    joinGame,
    userReady,
    handleDisconnect
};