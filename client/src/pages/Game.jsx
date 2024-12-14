import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Game = ({ socket }) => {

    const [users, setUsers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [readyList, setReadyList] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [timer, setTimer] = useState(null);

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem('user'));
        setIsAdmin(user === 'admin');

        socket.emit('joinGame', user);

        socket.on('updateUsers', (users) => setUsers(users));

        socket.on('gameStarted', () => {
            setGameStarted(true);
            setReadyList([]);
        });

        socket.on('readyList', (readyList) => setReadyList(readyList));

    }, [socket]);

    useEffect(() => {
        if (gameStarted) {
            let count = 1;
            const interval = setInterval(() => {
                if (count <= 3) {
                    setTimer(count++);
                } else {
                    clearInterval(interval);
                    setTimer(null);
                }
            }, 1000);
    
            return () => clearInterval(interval);
        }
    }, [gameStarted]);

    const startGame = () => {
        socket.emit('startGame');
    };

    const markReady = () => {
        socket.emit('userReady', {id: socket.id, timestamp: Date.now()});
    };

    return (
        <div>
            <h1>Game room</h1>

            {timer && <h3>Starting in: {timer}</h3>}

            {isAdmin && !gameStarted && <button onClick={startGame}>Start Game</button>}
            {gameStarted && !isAdmin && <button onClick={markReady}>Ready</button>}

            <div>
                <h2>Users:</h2>
                <ul>
                    {
                        users.map((user) => (
                            <li key={user.id}>{user?.nickname}</li>
                        ))
                    }
                </ul>
            </div>

            {gameStarted && (
                <div>
                    <h2>Ready Order:</h2>
                    <ul>
                        {readyList.map((user, index) => (
                            <li key={user.id}>{index+1}.{" "}{user?.nickname}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
};

Game.prototypes = {
    socket: PropTypes.object.isRequired
}

export default Game;