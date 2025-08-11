
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = ({ showNavigation = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigationItems = [
    { label: 'Home', path: '/home' },
    { label: 'Venues', path: '/venues' },
    { label: 'My Bookings', path: '/mybookings' },
    { label: 'Profile', path: '/profile' }
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-left">
          <div className="logo" onClick={() => navigate('/home')}>
            <span className="logo-icon">🏀</span>
            <span className="logo-text">QuickCourt</span>
          </div>
        </div>

        {showNavigation && (
          <>
            <nav className="header-nav">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="header-right">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search sports, venues, players..."
                  className="search-input"
                />
              </div>
              {isAuthenticated ? (
                <>
                  <div className="user-avatar" onClick={() => navigate('/profile')}>
                    <img src="../assets/user_img.png" alt="User" />
                  </div>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="nav-link" onClick={() => navigate('/login')}>Login</button>
                  <button className="get-started-btn" onClick={() => navigate('/register')}>
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {!showNavigation && (
          <div className="header-right">
            <button className="nav-link" onClick={() => navigate('/venues')}>Venues</button>
            <button className="nav-link" onClick={() => navigate('/mybookings')}>My Bookings</button>
            <button className="nav-link" onClick={() => navigate('/profile')}>Profile</button>
            {isAuthenticated ? (
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <button className="nav-link" onClick={() => navigate('/login')}>Login</button>
                <button className="get-started-btn" onClick={() => navigate('/home')}>
                  Get Started
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
