import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login'); 
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = mode === 'login' ? '/login' : '/register';
    try {
      const res = await axios.post(`http://localhost:3000${endpoint}`, formData);
      onLogin(res.data.user || res.data); // adjust based on backend
      navigate('/game');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-dark text-light">
      <div className="card p-4 shadow" style={{ minWidth: "300px" }}>
        <h3 className="mb-3 text-center">{mode === 'login' ? 'Login' : 'Register'}</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {mode === 'login' ? 'Log In' : 'Register'}
          </button>
        </form>

        <button
          className="btn btn-link mt-3 text-center"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Need to register?' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;