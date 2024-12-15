import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../design/Register.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Admin Credentials Check
    if (email === 'admin' && password === 'admin') {
      localStorage.setItem('role', 'admin'); // Store admin role
      navigate('/admin/products'); // Redirect to admin products page
      return;
    }

    try {
      // Normal User Login
      const response = await axios.post('http://localhost:3000/api/users/login', {
        email,
        password,
      });

      // Successful login: store user ID and role in localStorage
      const { user } = response.data;
      localStorage.setItem('userId', user._id);
      localStorage.setItem('role', 'user'); // Store user role

      alert(response.data.message);
      navigate('/home'); // Redirect to home page for users
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Error logging in. Please try again.');
    }
  };

  return (
    <div className="card p-4">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <p className="mt-3">
        Don’t have an account? <Link to="/register" className="login-link">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
