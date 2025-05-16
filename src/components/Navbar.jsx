import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Spooky Match</h1>
      {user && (
        <div className="space-x-4">
          <Link to="/game">Game</Link>
          <Link to="/scoreboard">Scoreboard</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={onLogout} className="ml-4 text-red-400">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;