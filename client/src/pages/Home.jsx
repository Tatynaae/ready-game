import {useState} from "react";
import {useNavigate} from "react-router-dom";
import PropTypes from 'prop-types';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/game");
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                id="user"
                placeholder="Enter your nickname"
                value={user}
                onChange={(e) => setUser(e.target.value)}
            />
            <button type="submit">Enter</button>
        </form>
    )
};

Home.prototypes = {
    socket: PropTypes.object.isRequired
}

export default Home;