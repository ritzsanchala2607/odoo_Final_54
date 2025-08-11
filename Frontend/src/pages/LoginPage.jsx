import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // ← make sure this is imported
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log(response.data); // Optional: for debugging

      // If login succeeds
      navigate('/home');
    } catch (err) {
      console.error(err);

      // Check if it's a network/backend error vs authentication error
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        // Backend is not available, but we can still navigate
        console.log('Backend unavailable, proceeding with frontend-only mode');
        setError('Backend unavailable. Proceeding in demo mode.');

        // Simulate successful login and navigate
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      } else {
        // Authentication error
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-container fade-in">
        <div className="login-form">
          <h1 className="login-title">Welcome back</h1>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="forgot-password">
              <button
                type="button"
                className="forgot-password-link"
                onClick={() => navigate('/verify-otp')}
              >
                Forgot password?
              </button>
            </div>
            <Button type="submit" variant="primary" fullWidth>
              Log In
            </Button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <Link to="/register" className="register-link">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
