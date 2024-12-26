import socketIO from "socket.io-client";
import { Route, Routes } from "react-router-dom";
import Game from "./pages/Game.jsx";
import Home from "./pages/Home.jsx";

const socket = socketIO.connect('http://localhost:8383', {
  'transports': ['websocket'],
});
// const socket = socketIO.connect('https://dace-193-34-225-215.ngrok-free.app');

function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game socket={ socket }/>} />
    </Routes>
  )
}

export default App
