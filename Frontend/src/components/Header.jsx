
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ showNavigation = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { label: 'Home', path: '/home' },
    { label: 'Venues', path: '/venues' },
    { label: 'My Bookings', path: '/mybookings' },
    { label: 'Profile', path: '/profile' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo" onClick={() => navigate('/home')}>
            <span className="logo-icon">🏢</span>
            <span className="logo-text">VenueBook</span>
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
                  placeholder="Search venues..."
                  className="search-input"
                />
              </div>
              <button className="notification-btn">🔔</button>
              <div className="user-avatar" onClick={() => navigate('/profile')}>
                <img src="../assets/user_img.png" alt="User" />
              </div>
            </div>
          </>
        )}

        {!showNavigation && (
          <div className="header-right">
            <button className="nav-link" onClick={() => navigate('/venues')}>Browse Venues</button>
            <button className="nav-link" onClick={() => navigate('/mybookings')}>My Bookings</button>
            <button className="nav-link" onClick={() => navigate('/profile')}>Profile</button>
            <button className="get-started-btn" onClick={() => navigate('/home')}>
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
