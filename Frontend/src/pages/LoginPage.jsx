import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import './LoginPage.css';
import { CloudCog } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await login(email, password);
      
      if (result?.success) {
        // Get the user role from localStorage which was set by AuthContext
        const userRole = localStorage.getItem('userRole');
        console.log(userRole);
        console.log(userRole == 'owner' ? 'Owner role detected' : 'User role detected');
        // Navigate based on role
        if (userRole === 'owner') {
          navigate('/owner-home');
        } else if(userRole ==='admin') {
          navigate('/admin-home');
        }else{
           navigate('/home');
        }
      } else {
        setError(result?.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
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
          <p className="signup-link">
            Don't have an account?{' '}
            <Link to="/register" className="signup-button">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
