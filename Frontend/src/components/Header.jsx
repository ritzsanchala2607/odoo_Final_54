import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';
import coin1 from '../assets/goldCoin/goldCoin1.png';
import coin2 from '../assets/goldCoin/goldCoin2.png';
import coin3 from '../assets/goldCoin/goldCoin3.png';
import coin4 from '../assets/goldCoin/goldCoin4.png';
import coin5 from '../assets/goldCoin/goldCoin5.png';
import coin6 from '../assets/goldCoin/goldCoin6.png';
import coin7 from '../assets/goldCoin/goldCoin7.png';
import coin8 from '../assets/goldCoin/goldCoin8.png';
import coin9 from '../assets/goldCoin/goldCoin9.png';

const Header = ({ showNavigation = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);


  const { isAuthenticated, logout, user, refreshUserData } = useAuth();
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
  const [userPoints, setUserPoints] = useState(localStorage.getItem('userPoints') || 0);
  const coinFrames = React.useMemo(() => [coin1, coin2, coin3, coin4, coin5, coin6, coin7, coin8, coin9], []);
  const [coinFrameIdx, setCoinFrameIdx] = useState(0);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Avoid forcing an auth re-check here; AuthProvider handles hydration

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  
  useEffect(() => {
    if (!isAuthenticated) return;
    const id = setInterval(() => {
      setCoinFrameIdx((i) => (i + 1) % coinFrames.length);
    }, 90);
    return () => clearInterval(id);
  }, [isAuthenticated, coinFrames]);



  const getAvatarUrl = () => {
    if (user && user.avatar_url) {
      // If avatar_url starts with '/', it's a relative path, otherwise it's a full URL
      if (user.avatar_url.startsWith('/')) {
        return `${import.meta.env.VITE_BACKEND_URL}${user.avatar_url}`;
      }
      return user.avatar_url;
    }
    // Fallback to default avatar
    return '../assets/user_profile.jpg';
  };

  const handleAvatarError = (e) => {
    // If user's avatar fails to load, fallback to default
    e.target.src = '../assets/user_profile.jpg';
  };


  useEffect(() => {
    // This effect will run whenever the user or isAuthenticated changes
    if (isAuthenticated) {
      setUserRole(localStorage.getItem('userRole'));
      setUserPoints(localStorage.getItem('userPoints') || 0);
    }
  }, [isAuthenticated, user]);

  const navigationItems = [
    { label: 'Home', path: '/home', requiresAuth: false },
    { label: 'Venues', path: '/venues', requiresAuth: true },
    { label: 'My Bookings', path: '/mybookings', requiresAuth: true },
    { label: 'Profile', path: '/profile', requiresAuth: true }
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
              {navigationItems
                .filter((item) => !item.requiresAuth || isAuthenticated)
                .map((item) => (
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
            
              {isAuthenticated && (
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                  <img
                    src={coinFrames[coinFrameIdx]}
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
              {isAuthenticated ? (
                <>
                  <div className="user-avatar" onClick={() => navigate('/profile')}>
                    <img src={getAvatarUrl()} alt="User" onError={handleAvatarError} />
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
            {isAuthenticated && (
              <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                <img
                  src={coinFrames[coinFrameIdx]}
                  alt="Points"
                  className="coin-spin"
                  style={{ width: '25px', height: '25px', marginRight: '5px' }}
                />
                <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#FFD700' }}>
                  {userPoints}
                </span>
              </div>
            )}
            {isAuthenticated && (
              <>
                <button className="nav-link" onClick={() => navigate('/venues')}>Venues</button>
                <button className="nav-link" onClick={() => navigate('/mybookings')}>My Bookings</button>
                <button className="nav-link" onClick={() => navigate('/profile')}>Profile</button>
              </>
            )}
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