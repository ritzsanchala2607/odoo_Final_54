import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Button from '../components/Button';
import './OwnerHomePage.css';

const OwnerHomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const getAvatarUrl = () => {
    if (user && user.avatar_url) {
      // If avatar_url starts with '/', it's a relative path, otherwise it's a full URL
      if (user.avatar_url.startsWith('/')) {
        return `${import.meta.env.VITE_BACKEND_URL}${user.avatar_url}`;
      }
      return user.avatar_url;
    }
    // Fallback to default avatar
    return '../assets/user_img.png';
  };

  const handleAvatarError = (e) => {
    // If user's avatar fails to load, fallback to default
    e.target.src = '../assets/user_img.png';
  };

  // Demo data for owner dashboard
  const venueStats = {
    totalVenues: 3,
    totalBookings: 24,
    monthlyRevenue: 2800,
    activeBookings: 8
  };

  const recentBookings = [
    { id: 1, venue: 'City Sports Arena', court: 'Basketball Court 1', user: 'John Doe', date: '2024-01-15', time: '18:00-20:00', status: 'confirmed' },
    { id: 2, venue: 'City Sports Arena', court: 'Tennis Court 2', user: 'Jane Smith', date: '2024-01-16', time: '19:00-21:00', status: 'pending' },
    { id: 3, venue: 'Greenfield Courts', court: 'Badminton Court 1', user: 'Mike Johnson', date: '2024-01-17', time: '20:00-22:00', status: 'confirmed' }
  ];

  const venues = [
    { id: 1, name: 'City Sports Arena', location: 'Downtown', status: 'active', courts: 4, rating: 4.7 },
    { id: 2, name: 'Greenfield Courts', location: 'Greenfield Ave', status: 'active', courts: 3, rating: 4.5 },
    { id: 3, name: 'Skyline Sports Hub', location: 'Skyline Road', status: 'maintenance', courts: 2, rating: 4.8 }
  ];

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Venues</h3>
          <p className="stat-number">{venueStats.totalVenues}</p>
        </div>
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{venueStats.totalBookings}</p>
        </div>
        <div className="stat-card">
          <h3>Monthly Revenue</h3>
          <p className="stat-number">${venueStats.monthlyRevenue}</p>
        </div>
        <div className="stat-card">
          <h3>Active Bookings</h3>
          <p className="stat-number">{venueStats.activeBookings}</p>
        </div>
      </div>

      <div className="recent-bookings">
        <h3>Recent Bookings</h3>
        <div className="bookings-list">
          {recentBookings.map(booking => (
            <div key={booking.id} className="booking-item">
              <div className="booking-info">
                <h4>{booking.venue} - {booking.court}</h4>
                <p>Booked by: {booking.user}</p>
                <p>Date: {booking.date} | Time: {booking.time}</p>
              </div>
              <span className={`status ${booking.status}`}>
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVenues = () => (
    <div className="venues-content">
      <div className="venues-header">
        <h3>My Venues</h3>
        <Button onClick={() => navigate('/add-venue')}>Add New Venue</Button>
      </div>
      <div className="venues-grid">
        {venues.map(venue => (
          <div key={venue.id} className="venue-card">
            <div className="venue-header">
              <h4>{venue.name}</h4>
              <span className={`status ${venue.status}`}>{venue.status}</span>
            </div>
            <p>Location: {venue.location}</p>
            <p>Courts: {venue.courts}</p>
            <p>Rating: ⭐ {venue.rating}</p>
            <div className="venue-actions">
              <Button variant="secondary" onClick={() => navigate(`/edit-venue/${venue.id}`)}>
                Edit
              </Button>
              <Button variant="secondary" onClick={() => navigate(`/venue-bookings/${venue.id}`)}>
                View Bookings
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bookings-content">
      <h3>All Bookings</h3>
      <div className="bookings-filters">
        <select defaultValue="all">
          <option value="all">All Venues</option>
          <option value="1">City Sports Arena</option>
          <option value="2">Greenfield Courts</option>
          <option value="3">Skyline Sports Hub</option>
        </select>
        <select defaultValue="all">
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="bookings-list">
        {recentBookings.map(booking => (
          <div key={booking.id} className="booking-item">
            <div className="booking-info">
              <h4>{booking.venue} - {booking.court}</h4>
              <p>Booked by: {booking.user}</p>
              <p>Date: {booking.date} | Time: {booking.time}</p>
            </div>
            <div className="booking-actions">
              <span className={`status ${booking.status}`}>
                {booking.status}
              </span>
              {booking.status === 'pending' && (
                <div className="action-buttons">
                  <Button variant="success" size="small">Approve</Button>
                  <Button variant="danger" size="small">Reject</Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-content">
      <h3>Analytics & Reports</h3>
      <div className="analytics-grid">
        <div className="chart-placeholder">
          <h4>Revenue Trend</h4>
          <p>Chart will be displayed here</p>
        </div>
        <div className="chart-placeholder">
          <h4>Booking Distribution</h4>
          <p>Chart will be displayed here</p>
        </div>
        <div className="chart-placeholder">
          <h4>Popular Time Slots</h4>
          <p>Chart will be displayed here</p>
        </div>
        <div className="chart-placeholder">
          <h4>Customer Satisfaction</h4>
          <p>Chart will be displayed here</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'venues':
        return renderVenues();
      case 'bookings':
        return renderBookings();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="owner-home-page">
      <Header showNavigation={false} />
      <div className="owner-container">
        <div className="owner-sidebar">
          <div className="owner-profile">
            <div className="profile-avatar">
              <img src={getAvatarUrl()} alt="Owner" onError={handleAvatarError} />
            </div>
            <h3>Venue Owner</h3>
            <p>Manage your venues and bookings</p>
          </div>
          
          <nav className="owner-nav">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-item ${activeTab === 'venues' ? 'active' : ''}`}
              onClick={() => setActiveTab('venues')}
            >
              🏟️ My Venues
            </button>
            <button 
              className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              📅 Bookings
            </button>
            <button 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📈 Analytics
            </button>
          </nav>
        </div>

        <div className="owner-main">
          <div className="main-header">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default OwnerHomePage;
