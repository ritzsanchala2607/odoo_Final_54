import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Calendar, MapPin, Star, DollarSign } from 'lucide-react';
import './OwnerHomePage.css';

const OwnerHomePage = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedSport, setSelectedSport] = useState('all');

  // Mock data
  const courtBookingData = [
    { court: 'Arena Sports Complex - Court A', venue: 'Arena Sports Complex', bookings: 245, sport: 'Badminton', revenue: 12250, rating: 4.8 },
    { court: 'Metro Sports Hub - Court 1', venue: 'Metro Sports Hub', bookings: 198, sport: 'Tennis', revenue: 9900, rating: 4.6 },
    { court: 'City Turf - Field B', venue: 'City Turf', bookings: 176, sport: 'Football', revenue: 8800, rating: 4.7 },
    { court: 'Elite Sports Center - Court 3', venue: 'Elite Sports Center', bookings: 152, sport: 'Badminton', revenue: 7600, rating: 4.5 },
    { court: 'Sports Plaza - Court 2', venue: 'Sports Plaza', bookings: 134, sport: 'Basketball', revenue: 6700, rating: 4.3 },
    { court: 'Prime Courts - Court A', venue: 'Prime Courts', bookings: 128, sport: 'Tennis', revenue: 6400, rating: 4.4 },
    { court: 'Galaxy Sports - Field 1', venue: 'Galaxy Sports', bookings: 112, sport: 'Cricket', revenue: 5600, rating: 4.2 },
    { court: 'Victory Sports - Court B', venue: 'Victory Sports', bookings: 98, sport: 'Badminton', revenue: 4900, rating: 4.1 }
  ];

  const recentFeedbacks = [
    { id: 1, user: 'Rahul Sharma', venue: 'Arena Sports Complex', court: 'Court A', rating: 5, comment: 'Excellent facilities and very clean courts. Staff was helpful too!', date: '2 hours ago', sport: 'Badminton' },
    { id: 2, user: 'Priya Patel', venue: 'Metro Sports Hub', court: 'Court 1', rating: 4, comment: 'Good court quality but parking could be better.', date: '5 hours ago', sport: 'Tennis' },
    { id: 3, user: 'Amit Kumar', venue: 'City Turf', court: 'Field B', rating: 5, comment: 'Amazing turf quality! Perfect for weekend matches.', date: '1 day ago', sport: 'Football' },
    { id: 4, user: 'Sneha Reddy', venue: 'Elite Sports Center', court: 'Court 3', rating: 3, comment: "Court was okay but AC wasn't working properly.", date: '1 day ago', sport: 'Badminton' },
    { id: 5, user: 'Vikram Singh', venue: 'Sports Plaza', court: 'Court 2', rating: 4, comment: 'Good experience overall. Will book again.', date: '2 days ago', sport: 'Basketball' }
  ];

  const bookingTrends = [
    { date: '2024-01-01', bookings: 45 },
    { date: '2024-01-02', bookings: 52 },
    { date: '2024-01-03', bookings: 48 },
    { date: '2024-01-04', bookings: 61 },
    { date: '2024-01-05', bookings: 78 },
    { date: '2024-01-06', bookings: 85 },
    { date: '2024-01-07', bookings: 72 }
  ];

  const sportDistribution = [
    { sport: 'Badminton', bookings: 525, color: '#8884d8' },
    { sport: 'Tennis', bookings: 326, color: '#82ca9d' },
    { sport: 'Football', bookings: 176, color: '#ffc658' },
    { sport: 'Basketball', bookings: 134, color: '#ff7300' },
    { sport: 'Cricket', bookings: 112, color: '#00ff88' }
  ];

  const filteredData = selectedSport === 'all'
    ? courtBookingData
    : courtBookingData.filter(item => item.sport.toLowerCase() === selectedSport.toLowerCase());

  const totalBookings = courtBookingData.reduce((sum, court) => sum + court.bookings, 0);
  const totalRevenue = courtBookingData.reduce((sum, court) => sum + court.revenue, 0);
  const averageRating = (courtBookingData.reduce((sum, court) => sum + court.rating, 0) / courtBookingData.length).toFixed(1);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="owner-homepage">
      <div className="owner-homepage-container">

        {/* Header */}
        <div className="owner-header">
          <h1 className="owner-title">QuickCourt Analytics Dashboard</h1>
          <p className="owner-subtitle">Monitor bookings, court performance, and user feedback</p>
        </div>

        {/* Metrics */}
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-card-content">
              <div className="metric-text">
                <p className="metric-label">Total Bookings</p>
                <p className="metric-value">{totalBookings.toLocaleString()}</p>
              </div>
              <Calendar className="metric-icon text-blue-600" />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-content">
              <div className="metric-text">
                <p className="metric-label">Active Courts</p>
                <p className="metric-value">{courtBookingData.length}</p>
              </div>
              <MapPin className="metric-icon text-green-600" />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-content">
              <div className="metric-text">
                <p className="metric-label">Total Revenue</p>
                <p className="metric-value">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="metric-icon text-yellow-600" />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-card-content">
              <div className="metric-text">
                <p className="metric-label">Average Rating</p>
                <p className="metric-value">{averageRating}</p>
              </div>
              <Star className="metric-icon text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Court performance */}
          <div className="court-ranking lg:col-span-2">
            <div className="court-ranking-header">
              <h2 className="court-ranking-title">Court Performance Ranking</h2>
              <div className="court-ranking-filter">
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="court-ranking-select"
                >
                  <option value="all">All Sports</option>
                  <option value="badminton">Badminton</option>
                  <option value="tennis">Tennis</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="cricket">Cricket</option>
                </select>
              </div>
            </div>

            <div className="court-ranking-list">
              <div className="space-y-4">
                {filteredData.map((court, index) => (
                  <div key={court.court} className="court-item">
                    <div className="court-item-index">{index + 1}</div>
                    <div className="court-item-info">
                      <h3 className="court-item-title">{court.court}</h3>
                      <p className="court-item-subtitle">{court.venue} • {court.sport}</p>
                    </div>
                    <div className="court-item-stats">
                      <p className="court-bookings">{court.bookings} bookings</p>
                      <div className="court-rating">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>{court.rating}</span>
                        <span className="court-revenue">₹{court.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="recent-feedback">
            <div className="recent-feedback-header">
              <h2 className="recent-feedback-title">Recent Feedback</h2>
            </div>
            <div className="recent-feedback-list">
              {recentFeedbacks.map((feedback) => (
                <div key={feedback.id} className="feedback-item">
                  <div className="feedback-header">
                    <div>
                      <h4 className="feedback-user">{feedback.user}</h4>
                      <p className="feedback-meta">{feedback.venue} - {feedback.court}</p>
                    </div>
                    <span className="feedback-date">{feedback.date}</span>
                  </div>
                  <div className="feedback-rating">
                    <div className="flex">{renderStars(feedback.rating)}</div>
                    <span className="feedback-rating-count">({feedback.rating}/5)</span>
                  </div>
                  <p className="feedback-comment">"{feedback.comment}"</p>
                  <span className="feedback-sport">{feedback.sport}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Trends */}
          <div className="chart-card">
            <div className="chart-header">
              <h2 className="chart-title">Booking Trends (Last 7 Days)</h2>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={bookingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sport distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h2 className="chart-title">Bookings by Sport</h2>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={sportDistribution} cx="50%" cy="50%" labelLine={false}
                    label={({ sport, percent }) => `${sport} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80} dataKey="bookings">
                    {sportDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OwnerHomePage;
