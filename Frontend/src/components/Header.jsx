
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ showNavigation = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
 const [userRole, setUserRole] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    setUserRole(localStorage.getItem('userRole'));
    setUserPoints(localStorage.getItem('userPoints') || 0);
  }, []);
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
            
              {userRole === 'user' && (
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
               
                  <img 
                  src="/assets/coin.png" 
                  alt="Points" 
                  className="coin-spin"
                  style={{ width: '25px', height: '25px', marginRight: '5px' }} 
                />
                  <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#FFD700' }}>
                    {userPoints}
                  </span>
                </div>
              )}
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search sports, venues, players..."
                  className="search-input"
                />
              </div>
              <button className="nav-link" onClick={() => navigate('/login')}>Login</button>
              <button className="get-started-btn" onClick={() => navigate('/register')}>
                Sign Up
              </button>
              <div className="user-avatar" onClick={() => navigate('/profile')}>
                <img src="../assets/user_img.png" alt="User" />
              </div>
            </div>
          </>
        )}

        {!showNavigation && (
          <div className="header-right">
            <button className="nav-link" onClick={() => navigate('/venues')}>Venues</button>
            <button className="nav-link" onClick={() => navigate('/mybookings')}>My Bookings</button>
            <button className="nav-link" onClick={() => navigate('/profile')}>Profile</button>
            <button className="nav-link" onClick={() => navigate('/login')}>Login</button>
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
