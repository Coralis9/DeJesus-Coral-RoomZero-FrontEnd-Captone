import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const users = JSON.parse(localStorage.getItem('users')) || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      const user = users.find(
        u => u.username === form.username && u.password === form.password
      );
      if (user) {
        onLogin(user);
        navigate('/game');
      } else {
        alert('Invalid login');
      }
    } else {
      if (users.find(u => u.username === form.username)) {
        alert('Username already exists');
        return;
      }
      const newUser = { ...form, bestScore: 0, bestTime: 0, gamesPlayed: 0, wins: 0 };
      const updatedUsers = [...users, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      onLogin(newUser);
      navigate('/game');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-10 text-white">
      <h2 className="text-2xl mb-4">{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          className="w-full p-2 rounded bg-gray-800"
        />
        {mode === 'register' && (
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full p-2 rounded bg-gray-800"
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full p-2 rounded bg-gray-800"
        />
        <button type="submit" className="bg-purple-800 w-full py-2 rounded hover:bg-purple-700">
          {mode === 'login' ? 'Log In' : 'Register'}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        className="mt-4 text-sm underline text-purple-400"
      >
        {mode === 'login' ? 'Need to register?' : 'Already have an account?'}
      </button>
    </div>
  );
};

export default LoginPage;