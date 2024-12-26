const { users, readyList } = require('../services/socketService');

const startGame = (socket, io) => {
    const user = users?.find(u => u.id === socket.id);

    if(user?.nickname === 'admin'){
        console.log('Game started by admin');
        io.emit('gameStarted');
        // readyList.length = 0;
    } else {
        console.log('Only the admin can start the game');
    }
};

const endGame = (socket, io) => {
    const user = users?.find(u => u.id === socket.id);

    if(user?.nickname === 'admin'){
        console.log('Game ended by admin');
        io.emit('gameEnded');
        // users.length = 0;
        // readyList.length = 0;
    } else {
        console.log('Only the admin can end the game');
    }
};

module.exports = {
    startGame,
    endGame
};