import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Header showNavigation />
      <div className="home-container fade-in">
        <div className="welcome-section">
          <h1>Welcome to VenueBook</h1>
          <p>Find and book the perfect venue for your next event</p>
          <div className="action-buttons">
            <Button onClick={() => navigate('/venues')} variant="primary">
              Browse Venues
            </Button>
            <Button onClick={() => navigate('/mybookings')} variant="secondary">
              View My Bookings
            </Button>
          </div>
        </div>

        <div className="features-section">
          <h2>Why Choose VenueBook?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Easy Discovery</h3>
              <p>Browse through hundreds of venues with detailed information and real-time availability</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Instant Booking</h3>
              <p>Book your preferred venue instantly with our streamlined booking process</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Get competitive rates and transparent pricing for all venues</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Verified Venues</h3>
              <p>All venues are verified and quality-checked for your peace of mind</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Find Your Perfect Venue?</h2>
          <p>Join thousands of satisfied customers who have found their ideal event spaces</p>
          <Button onClick={() => navigate('/venues')} variant="primary" size="large">
            Start Exploring
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
