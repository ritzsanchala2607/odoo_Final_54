import { PlusCircle, MapPin, X } from 'lucide-react';

import React, { useState } from 'react';
import './OwnerHomePage.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  Calendar, Star, TrendingUp, Users, DollarSign, Activity, Trophy, AlertTriangle, Zap, Eye, BarChart3, TrendingDown,
  LogOut, User, Filter, Target, Brain} from 'lucide-react';

const OwnerHomePage = () => {
    const [myCourts] = useState([
    { id: 1, name: 'Court A', venue: 'Arena Sports Complex', sport: 'Badminton', price: '₹500/hr', status: 'Active' },
    { id: 2, name: 'Court B', venue: 'Arena Sports Complex', sport: 'Tennis', price: '₹600/hr', status: 'Active' },
    { id: 3, name: 'Field 1', venue: 'City Turf', sport: 'Football', price: '₹800/hr', status: 'Inactive' },
  ]);

    const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedPrediction, setSelectedPrediction] = useState(null);


const [newVenue, setNewVenue] = useState({
  name: '',
  slug: '',
  description: '',
  address: '',
  city: '',
  latitude: '',
  longitude: '',
  starting_price: '',
  maxCourts: 1
});

const handleVenueChange = (e) => {
  const { name, value } = e.target;
  setNewVenue(prev => ({ ...prev, [name]: value }));

  // Auto-create slug when user types name
  if (name === 'name') {
    const slugValue = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setNewVenue(prev => ({ ...prev, slug: slugValue }));
  }
};

const handleVenueSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/venues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newVenue.name,
        slug: newVenue.slug,
        description: newVenue.description,
        address: newVenue.address,
        city: newVenue.city,
        latitude: parseFloat(newVenue.latitude),
        longitude: parseFloat(newVenue.longitude),
        starting_price: parseFloat(newVenue.starting_price)
      })
    });

    if (response.ok) {
      const result = await response.json();
      alert('Venue created successfully!');
      setShowVenueModal(false);
      setNewVenue({
        name: '',
        slug: '',
        description: '',
        address: '',
        city: '',
        latitude: '',
        longitude: '',
        starting_price: '',
        maxCourts: 1
      });
      // Refresh venues list
      fetchVenues();
    } else {
      const error = await response.json();
      alert(`Error creating venue: ${error.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error creating venue:', error);
    alert('Failed to create venue. Please try again.');
  }
};

  const [showVenueModal, setShowVenueModal] = useState(false);



  // Get the current user from AuthContext


  // Fallback for missing user data
  const displayName = user?.full_name || user?.name || user?.email || 'Owner';
  const displayEmail = user?.email || '';
  const displayAvatar = user?.avatar_url || user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
    console.log('Logout clicked');
  };
  
  // Venues state
const [venues, setVenues] = useState([]);
const [loading, setLoading] = useState(false);

// Fetch venues from API
const fetchVenues = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/venues', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      setVenues(result.rows || result || []);
    } else {
      console.error('Failed to fetch venues');
    }
  } catch (error) {
    console.error('Error fetching venues:', error);
  } finally {
    setLoading(false);
  }
};

// Fetch venues on component mount
React.useEffect(() => {
  fetchVenues();
}, []);

// const [showVenueModal, setShowVenueModal] = useState(false);
const [showCourtModal, setShowCourtModal] = useState(false);

const [selectedVenue, setSelectedVenue] = useState(null);
// const [newCourt, setNewCourt] = useState({ courtName: "", sport: "", capacity: "", price: "" });
const [newCourt, setNewCourt] = useState({
  name: "",
  sport_type: "",
  price_per_hour: "",
  price_per_person: "",
  allow_per_hour: true,
  allow_per_person: false,
  refund_ratio_override: "",
  capacity: 1,
  is_active: true
});
const handleCourtChange = (e) => {
  const { name, value } = e.target;
  setNewCourt((prev) => ({ ...prev, [name]: value }));
};


const openAddCourtModal = (venueId) => {
  const venue = venues.find(v => v.id === venueId);
  setSelectedVenue(venue);
  setShowCourtModal(true);
};

const handleCourtSubmit = async (e) => {
  e.preventDefault();
  if (!selectedVenue) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/courts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        venue_id: selectedVenue.id,
        name: newCourt.name,
        sport_type: newCourt.sport_type,
        price_per_hour: parseFloat(newCourt.price_per_hour),
        price_per_person: newCourt.price_per_person ? parseFloat(newCourt.price_per_person) : null,
        allow_per_hour: newCourt.allow_per_hour,
        allow_per_person: newCourt.allow_per_person,
        refund_ratio_override: newCourt.refund_ratio_override ? parseFloat(newCourt.refund_ratio_override) : null,
        capacity: parseInt(newCourt.capacity),
        is_active: newCourt.is_active
      })
    });

    if (response.ok) {
      const result = await response.json();
      alert('Court created successfully!');
      setShowCourtModal(false);
      setNewCourt({
        name: "",
        sport_type: "",
        price_per_hour: "",
        price_per_person: "",
        allow_per_hour: true,
        allow_per_person: false,
        refund_ratio_override: "",
        capacity: 1,
        is_active: true
      });
      // Optionally refresh courts list here
    } else {
      const error = await response.json();
      alert(`Error creating court: ${error.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error creating court:', error);
    alert('Failed to create court. Please try again.');
  }
};



  // Mock data
  const courtBookingData = [
    { court: 'Arena Sports Complex - Court A', venue: 'Arena Sports Complex', bookings: 245, sport: 'Badminton', revenue: 12250, rating: 4.8, utilization: 92, peakHours: '6-8 PM' },
    { court: 'Metro Sports Hub - Court 1', venue: 'Metro Sports Hub', bookings: 198, sport: 'Tennis', revenue: 9900, rating: 4.6, utilization: 78, peakHours: '7-9 AM' },
    { court: 'City Turf - Field B', venue: 'City Turf', bookings: 176, sport: 'Football', revenue: 8800, rating: 4.7, utilization: 85, peakHours: '5-7 PM' },
    { court: 'Elite Sports Center - Court 3', venue: 'Elite Sports Center', bookings: 152, sport: 'Badminton', revenue: 7600, rating: 4.5, utilization: 68, peakHours: '8-10 AM' },
    { court: 'Sports Plaza - Court 2', venue: 'Sports Plaza', bookings: 134, sport: 'Basketball', revenue: 6700, rating: 4.3, utilization: 72, peakHours: '6-8 PM' },
    { court: 'Prime Courts - Court A', venue: 'Prime Courts', bookings: 128, sport: 'Tennis', revenue: 6400, rating: 4.4, utilization: 65, peakHours: '9-11 AM' },
    { court: 'Galaxy Sports - Field 1', venue: 'Galaxy Sports', bookings: 112, sport: 'Cricket', revenue: 5600, rating: 4.2, utilization: 58, peakHours: '4-6 PM' },
    { court: 'Victory Sports - Court B', venue: 'Victory Sports', bookings: 98, sport: 'Badminton', revenue: 4900, rating: 4.1, utilization: 55, peakHours: '7-9 PM' }
  ];

  const recentBookings = [
    { id: 1, user: 'Rajesh Kumar', venue: 'Arena Sports Complex', court: 'Court A', sport: 'Badminton', date: '2024-08-11', time: '18:00-19:00', status: 'Confirmed', amount: 500 },
    { id: 2, user: 'Priya Singh', venue: 'Metro Sports Hub', court: 'Court 1', sport: 'Tennis', date: '2024-08-11', time: '19:00-20:00', status: 'Confirmed', amount: 600 },
    { id: 3, user: 'Amit Sharma', venue: 'City Turf', court: 'Field B', sport: 'Football', date: '2024-08-11', time: '17:30-18:30', status: 'Pending', amount: 800 },
    { id: 4, user: 'Neha Patel', venue: 'Elite Sports Center', court: 'Court 3', sport: 'Badminton', date: '2024-08-11', time: '20:00-21:00', status: 'Confirmed', amount: 450 },
    { id: 5, user: 'Vikram Reddy', venue: 'Sports Plaza', court: 'Court 2', sport: 'Basketball', date: '2024-08-11', time: '16:00-17:00', status: 'Confirmed', amount: 550 }
  ];

  const customerReviews = [
    { id: 1, user: 'Rahul Sharma', venue: 'Arena Sports Complex', court: 'Court A', rating: 5, comment: 'Excellent facilities and very clean courts. Staff was helpful too!', date: '2 hours ago', sport: 'Badminton', verified: true },
    { id: 2, user: 'Priya Patel', venue: 'Metro Sports Hub', court: 'Court 1', rating: 4, comment: 'Good court quality but parking could be better.', date: '5 hours ago', sport: 'Tennis', verified: true },
    { id: 3, user: 'Amit Kumar', venue: 'City Turf', court: 'Field B', rating: 5, comment: 'Amazing turf quality! Perfect for weekend matches.', date: '1 day ago', sport: 'Football', verified: false },
    { id: 4, user: 'Sneha Reddy', venue: 'Elite Sports Center', court: 'Court 3', rating: 3, comment: 'Court was okay but AC wasn\'t working properly. Need better maintenance.', date: '1 day ago', sport: 'Badminton', verified: true },
    { id: 5, user: 'Vikram Singh', venue: 'Sports Plaza', court: 'Court 2', rating: 4, comment: 'Good experience overall. Will book again for sure.', date: '2 days ago', sport: 'Basketball', verified: true },
    { id: 6, user: 'Kavya Nair', venue: 'Prime Courts', court: 'Court A', rating: 2, comment: 'Poor maintenance and booking system was confusing.', date: '2 days ago', sport: 'Tennis', verified: true },
    { id: 7, user: 'Arjun Verma', venue: 'Galaxy Sports', court: 'Field 1', rating: 5, comment: 'Outstanding cricket pitch quality! Will definitely return.', date: '3 days ago', sport: 'Cricket', verified: true },
    { id: 8, user: 'Meera Gupta', venue: 'Victory Sports', court: 'Court B', rating: 1, comment: 'Very disappointed with the service and court condition.', date: '3 days ago', sport: 'Badminton', verified: false }
  ];

  const hourlyBookings = [
    { hour: '6 AM', bookings: 15, revenue: 750 },
    { hour: '7 AM', bookings: 28, revenue: 1400 },
    { hour: '8 AM', bookings: 35, revenue: 1750 },
    { hour: '9 AM', bookings: 22, revenue: 1100 },
    { hour: '10 AM', bookings: 18, revenue: 900 },
    { hour: '11 AM', bookings: 12, revenue: 600 },
    { hour: '12 PM', bookings: 8, revenue: 400 },
    { hour: '1 PM', bookings: 6, revenue: 300 },
    { hour: '2 PM', bookings: 9, revenue: 450 },
    { hour: '3 PM', bookings: 14, revenue: 700 },
    { hour: '4 PM', bookings: 25, revenue: 1250 },
    { hour: '5 PM', bookings: 32, revenue: 1600 },
    { hour: '6 PM', bookings: 45, revenue: 2250 },
    { hour: '7 PM', bookings: 48, revenue: 2400 },
    { hour: '8 PM', bookings: 38, revenue: 1900 },
    { hour: '9 PM', bookings: 25, revenue: 1250 },
    { hour: '10 PM', bookings: 12, revenue: 600 }
  ];

  const monthlyTrends = [
    { month: 'Jan', bookings: 1245, revenue: 62250, newUsers: 156 },
    { month: 'Feb', bookings: 1389, revenue: 69450, newUsers: 178 },
    { month: 'Mar', bookings: 1523, revenue: 76150, newUsers: 203 },
    { month: 'Apr', bookings: 1678, revenue: 83900, newUsers: 234 },
    { month: 'May', bookings: 1834, revenue: 91700, newUsers: 267 },
    { month: 'Jun', bookings: 1967, revenue: 98350, newUsers: 289 },
    { month: 'Jul', bookings: 2156, revenue: 107800, newUsers: 312 },
    { month: 'Aug', bookings: 1843, revenue: 92150, newUsers: 198 }
  ];

  const venuePerformance = [
    { venue: 'Arena Sports Complex', bookings: 245, revenue: 12250, utilization: 92, satisfaction: 4.8 },
    { venue: 'Metro Sports Hub', bookings: 198, revenue: 9900, utilization: 78, satisfaction: 4.6 },
    { venue: 'City Turf', bookings: 176, revenue: 8800, utilization: 85, satisfaction: 4.7 },
    { venue: 'Elite Sports Center', bookings: 152, revenue: 7600, utilization: 68, satisfaction: 4.5 },
    { venue: 'Sports Plaza', bookings: 134, revenue: 6700, utilization: 72, satisfaction: 4.3 },
    { venue: 'Prime Courts', bookings: 128, revenue: 6400, utilization: 65, satisfaction: 4.4 }
  ];

  const sportsDistribution = [
    { sport: 'Badminton', count: 465, percentage: 35 },
    { sport: 'Tennis', count: 326, percentage: 25 },
    { sport: 'Football', count: 264, percentage: 20 },
    { sport: 'Basketball', count: 134, percentage: 10 },
    { sport: 'Cricket', count: 132, percentage: 10 }
  ];

  // Enhanced prediction data with interactive features
  const predictionMetrics = [
    { 
      id: 'bookings',
      metric: 'Bookings Next Week', 
      current: 285, 
      predicted: 312, 
      confidence: 87, 
      trend: 'up',
      factors: ['Peak season approaching', 'New court opening', 'Marketing campaign'],
      details: {
        breakdown: [
          { day: 'Mon', predicted: 42, confidence: 89 },
          { day: 'Tue', predicted: 38, confidence: 85 },
          { day: 'Wed', predicted: 45, confidence: 91 },
          { day: 'Thu', predicted: 48, confidence: 88 },
          { day: 'Fri', predicted: 52, confidence: 85 },
          { day: 'Sat', predicted: 48, confidence: 83 },
          { day: 'Sun', predicted: 39, confidence: 87 }
        ]
      }
    },
    { 
      id: 'revenue',
      metric: 'Revenue Forecast (₹)', 
      current: 14250, 
      predicted: 16800, 
      confidence: 82, 
      trend: 'up',
      factors: ['Premium court additions', 'Price optimization', 'Corporate bookings'],
      details: {
        breakdown: [
          { day: 'Mon', predicted: 2100, confidence: 84 },
          { day: 'Tue', predicted: 1950, confidence: 80 },
          { day: 'Wed', predicted: 2400, confidence: 86 },
          { day: 'Thu', predicted: 2600, confidence: 82 },
          { day: 'Fri', predicted: 2900, confidence: 79 },
          { day: 'Sat', predicted: 2750, confidence: 81 },
          { day: 'Sun', predicted: 2100, confidence: 85 }
        ]
      }
    },
    { 
      id: 'users',
      metric: 'New User Signups', 
      current: 45, 
      predicted: 38, 
      confidence: 79, 
      trend: 'down',
      factors: ['Market saturation', 'Competitor activity', 'Seasonal decline'],
      details: {
        breakdown: [
          { day: 'Mon', predicted: 6, confidence: 78 },
          { day: 'Tue', predicted: 5, confidence: 82 },
          { day: 'Wed', predicted: 7, confidence: 76 },
          { day: 'Thu', predicted: 4, confidence: 80 },
          { day: 'Fri', predicted: 8, confidence: 75 },
          { day: 'Sat', predicted: 5, confidence: 81 },
          { day: 'Sun', predicted: 3, confidence: 83 }
        ]
      }
    },
    { 
      id: 'retention',
      metric: 'Customer Retention (%)', 
      current: 78, 
      predicted: 84, 
      confidence: 91, 
      trend: 'up',
      factors: ['Loyalty program launch', 'Service improvements', 'Facility upgrades'],
      details: {
        breakdown: [
          { segment: 'New Users', predicted: 72, confidence: 88 },
          { segment: 'Regular Users', predicted: 89, confidence: 94 },
          { segment: 'Premium Users', predicted: 95, confidence: 92 },
          { segment: 'Corporate', predicted: 87, confidence: 90 }
        ]
      }
    }
  ];

  const totalBookings = courtBookingData.reduce((sum, court) => sum + court.bookings, 0);
  const totalRevenue = courtBookingData.reduce((sum, court) => sum + court.revenue, 0);
  const averageRating = (courtBookingData.reduce((sum, court) => sum + court.rating, 0) / courtBookingData.length).toFixed(1);
  const averageUtilization = Math.round(courtBookingData.reduce((sum, court) => sum + court.utilization, 0) / courtBookingData.length);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'insights', label: 'Customer Insights', icon: Users },
    { id: 'predictions', label: 'Predictions', icon: Zap },
    { id: 'mycourts', label: 'My Courts', icon: Zap },
     { id: 'venues', label: 'My Venues', icon: Zap }
     
  ];

  const performanceFilters = [
    { id: 'all', label: 'All Time' },
    { id: 'week', label: 'Last Week' },
    { id: 'month', label: 'Last Month' },
    { id: 'year', label: 'Last Year' }
  ];

  const ratingFilters = [
    { id: 'all', label: 'All Ratings' },
    { id: '5', label: '5 Stars' },
    { id: '4', label: '4+ Stars' },
    { id: '3', label: '3+ Stars' },
    { id: '2', label: '2+ Stars' },
    { id: '1', label: '1+ Stars' }
  ];

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={i < rating ? 'star-filled' : 'star-empty'} />
    ));

  const getStatusClass = (status) => {
    switch (status) {
      case 'Confirmed': return 'status-confirmed';
      case 'Pending': return 'status-pending';
      case 'Cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="trend-up" />;
      case 'down': return <TrendingDown className="trend-down" />;
      default: return <Activity className="trend-stable" />;
    }
  };

  const getFilteredReviews = () => {
    if (ratingFilter === 'all') return customerReviews;
    const minRating = parseInt(ratingFilter);
    return customerReviews.filter(review => review.rating >= minRating);
  };

  const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#9333ea'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-grid">
            <div className="card">
              <div className="card-header">
                <h3>Top Performing Courts</h3>
              </div>
              <div className="card-body">
                {courtBookingData.slice(0, 6).map((court, index) => (
                  <div key={court.court} className="performance-item">
                    <div className="performance-rank">{index + 1}</div>
                    <div className="performance-info">
                      <div className="performance-title">{court.court}</div>
                      <div className="performance-subtitle">{court.venue} • {court.sport}</div>
                    </div>
                    <div className="performance-stats">
                      <div className="stat-value">{court.bookings}</div>
                      <div className="stat-label">bookings</div>
                    </div>
                    <div className="performance-stats">
                      <div className="stat-value">₹{court.revenue.toLocaleString()}</div>
                      <div className="stat-label">revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Recent Bookings</h3>
              </div>
              <div className="card-body">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-info">
                      <div className="booking-user">{booking.user}</div>
                      <div className="booking-venue">{booking.venue} - {booking.court}</div>
                      <div className="booking-time">{booking.date} • {booking.time}</div>
                    </div>
                    <div className="booking-status">
                      <span className={getStatusClass(booking.status)}>
                        {booking.status}
                      </span>
                      <div className="booking-amount">₹{booking.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="performance-section">
            <div className="performance-filters">
              <div className="filter-group">
                <Filter className="filter-icon" />
                <span className="filter-label">Time Period:</span>
                <div className="filter-buttons">
                  {performanceFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setPerformanceFilter(filter.id)}
                      className={`filter-button ${performanceFilter === filter.id ? 'active' : ''}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="performance-grid">
              <div className="card chart-card">
                <div className="card-header">
                  <h3>Hourly Booking Trends</h3>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={hourlyBookings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="bookings" stroke="#2563eb" fill="#dbeafe" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card chart-card">
                <div className="card-header">
                  <h3>Monthly Revenue Trend</h3>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card chart-card">
                <div className="card-header">
                  <h3>Venue Performance Comparison</h3>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={venuePerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="venue" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="utilization" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card chart-card">
                <div className="card-header">
                  <h3>Sports Distribution</h3>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sportsDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ sport, percentage }) => `${sport} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {sportsDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );

      case 'insights':
        return (
          <div className="insights-section">
            <div className="insights-filters">
              <div className="filter-group">
                <Star className="filter-icon" />
                <span className="filter-label">Filter by Rating:</span>
                <div className="filter-buttons">
                  {ratingFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setRatingFilter(filter.id)}
                      className={`filter-button ${ratingFilter === filter.id ? 'active' : ''}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="insights-grid">
              <div className="card reviews-card">
                <div className="card-header">
                  <h3>Customer Reviews ({getFilteredReviews().length} reviews)</h3>
                </div>
                <div className="card-body">
                  {getFilteredReviews().map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="review-user">
                          <div className="user-name">{review.user}</div>
                          {review.verified && <span className="verified-badge">Verified</span>}
                        </div>
                        <div className="review-date">{review.date}</div>
                      </div>
                      <div className="review-rating">
                        <div className="stars">{renderStars(review.rating)}</div>
                        <span className="rating-number">({review.rating}/5)</span>
                      </div>
                      <div className="review-venue">{review.venue} - {review.court}</div>
                      <div className="review-comment">{review.comment}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'predictions':
        return (
          <div className="predictions-section">
            <div className="prediction-overview">
              <Brain className="prediction-brain-icon" />
              <h2>AI-Powered Predictive Analytics</h2>
              <p>Machine learning insights and forecasting for the next 7 days</p>
            </div>
            
            <div className="predictions-grid">
              {predictionMetrics.map((pred, index) => (
                <div 
                  key={index} 
                  className={`prediction-card ${selectedPrediction === pred.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPrediction(selectedPrediction === pred.id ? null : pred.id)}
                >
                  <div className="prediction-header">
                    <div className="prediction-metric">{pred.metric}</div>
                    <div className="prediction-trend">{getTrendIcon(pred.trend)}</div>
                  </div>
                  <div className="prediction-values">
                    <div className="current-value">
                      <span className="value-label">Current</span>
                      <span className="value-number">{pred.current.toLocaleString()}</span>
                    </div>
                    <div className="predicted-value">
                      <span className="value-label">Predicted</span>
                      <span className="value-number">{pred.predicted.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="confidence-bar">
                    <div className="confidence-label">Confidence: {pred.confidence}%</div>
                    <div className="confidence-fill">
                      <div 
                        className="confidence-progress" 
                        style={{ width: `${pred.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="prediction-factors">
                    <div className="factors-label">Key Factors:</div>
                    <ul className="factors-list">
                      {pred.factors.map((factor, i) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {selectedPrediction === pred.id && (
                    <div className="prediction-details">
                      <div className="details-header">
                        <Target className="details-icon" />
                        <span>Detailed Breakdown</span>
                      </div>
                      <div className="details-chart">
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={pred.details.breakdown}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={pred.id === 'retention' ? 'segment' : 'day'} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="predicted" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                  
                  <div className="click-hint">
                    {selectedPrediction === pred.id ? 'Click to collapse' : 'Click for detailed breakdown'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'mycourts':
        return (
          <div className="mycourts-section">
            <div className="mycourts-header">
              <h3>My Courts</h3>
            </div>
            <div className="courts-list">
              {myCourts.map((court) => (
                <div key={court.id} className="court-card">
                  <div className="court-info">
                    <h4>{court.name}</h4>
                    <p><MapPin size={14} /> {court.venue}</p>
                    <p>Sport: {court.sport}</p>
                    <p>Price: {court.price}</p>
                  </div>
                  <span className={`court-status ${court.status.toLowerCase()}`}>{court.status}</span>
                </div>
              ))}
            </div>
          </div>
        );

        case 'venues':
  return (
    <div className="venues-section">
      <div className="venues-header">
        <h3>My Venues</h3>
        <button className="new-venue-btn" onClick={() => setShowVenueModal(true)}>
          <PlusCircle size={18} /> Create / Open New Venue
        </button>
      </div>

      <div className="venue-list">
        {loading ? (
          <div className="loading">Loading venues...</div>
        ) : venues.length === 0 ? (
          <div className="no-venues">No venues found. Create your first venue!</div>
        ) : (
          venues.map((venue) => (
            <div key={venue.id} className="venue-card">
              <div className="venue-info">
                <h4>{venue.name}</h4>
                <p><MapPin size={14} /> {venue.city || venue.address}</p>
                <p>Status: {venue.status}</p>
                <p>Starting Price: ₹{venue.starting_price}/hr</p>
              </div>

              <div className="venue-actions">
                <button
                  onClick={() => openAddCourtModal(venue.id)}
                  disabled={venue.status !== 'approved'}
                >
                  Add Court
                </button>
              </div>
            </div>
          ))
        )}
      </div>

     
      {showVenueModal && (
  <div className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <h3>Create New Venue</h3>
        <button className="close-btn" onClick={() => setShowVenueModal(false)}>
          <X size={18} />
        </button>
      </div>
      <form className="modal-form" onSubmit={handleVenueSubmit}>
        
        <label>Venue Name *</label>
        <input type="text" name="name" value={newVenue.name} onChange={handleVenueChange} required />

        <label>Slug *</label>
        <input type="text" name="slug" value={newVenue.slug} onChange={handleVenueChange} required />

        <label>Description</label>
        <textarea name="description" value={newVenue.description} onChange={handleVenueChange}></textarea>

        <label>Address *</label>
        <input type="text" name="address" value={newVenue.address} onChange={handleVenueChange} required />

        <label>City *</label>
        <input type="text" name="city" value={newVenue.city} onChange={handleVenueChange} required />

        <div className="form-row">
          <div>
            <label>Latitude *</label>
            <input type="number" step="any" name="latitude" value={newVenue.latitude} onChange={handleVenueChange} required />
          </div>
          <div>
            <label>Longitude *</label>
            <input type="number" step="any" name="longitude" value={newVenue.longitude} onChange={handleVenueChange} required />
          </div>
        </div>

        <label>Starting Price (₹/hr) *</label>
        <input type="number" step="0.01" name="starting_price" value={newVenue.starting_price} onChange={handleVenueChange} required />

        <label>Max Courts Allowed</label>
        <input type="number" name="maxCourts" value={newVenue.maxCourts} onChange={handleVenueChange} min="1" required />

        <div className="modal-actions">
          <button type="submit" className="btn-primary">Save Venue</button>
          <button type="button" className="btn-secondary" onClick={() => setShowVenueModal(false)}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}


     {showCourtModal && selectedVenue && (
  <div className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <h3>Add Court to {selectedVenue.name}</h3>
        <button className="close-btn" onClick={() => setShowCourtModal(false)}>
          <X size={18} />
        </button>
      </div>
      <form className="modal-form" onSubmit={handleCourtSubmit}>
        
        {/* Court Name */}
        <label>Court Name *</label>
        <input
          type="text"
          name="name"
          value={newCourt.name}
          onChange={handleCourtChange}
          required
        />

        {/* Sport Type */}
        <label>Sport Type *</label>
        <select
          name="sport_type"
          value={newCourt.sport_type}
          onChange={handleCourtChange}
          required
        >
          <option value="">Select sport</option>
          <option>Badminton</option>
          <option>Tennis</option>
          <option>Football</option>
          <option>Basketball</option>
          <option>Cricket</option>
        </select>

        {/* Price Per Hour */}
        <label>Price Per Hour (₹) *</label>
        <input
          type="number"
          step="0.01"
          name="price_per_hour"
          value={newCourt.price_per_hour}
          onChange={handleCourtChange}
          required={newCourt.allow_per_hour}
          disabled={!newCourt.allow_per_hour}
        />

        {/* Price Per Person */}
        <label>Price Per Person (₹)</label>
        <input
          type="number"
          step="0.01"
          name="price_per_person"
          value={newCourt.price_per_person}
          onChange={handleCourtChange}
          required={newCourt.allow_per_person}
          disabled={!newCourt.allow_per_person}
        />

        {/* Allow Booking Type */}
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="allow_per_hour"
              checked={newCourt.allow_per_hour}
              onChange={(e) =>
                setNewCourt((prev) => ({
                  ...prev,
                  allow_per_hour: e.target.checked
                }))
              }
            />
            Allow Per Hour Booking
          </label>

          <label>
            <input
              type="checkbox"
              name="allow_per_person"
              checked={newCourt.allow_per_person}
              onChange={(e) =>
                setNewCourt((prev) => ({
                  ...prev,
                  allow_per_person: e.target.checked
                }))
              }
            />
            Allow Per Person Booking
          </label>
        </div>

        {/* Refund Ratio */}
        <label>Refund Ratio Override (%)</label>
        <input
          type="number"
          step="0.01"
          name="refund_ratio_override"
          value={newCourt.refund_ratio_override}
          onChange={handleCourtChange}
          placeholder="Leave empty for default"
        />

        {/* Capacity */}
        <label>Capacity *</label>
        <input
          type="number"
          name="capacity"
          min="1"
          value={newCourt.capacity}
          onChange={handleCourtChange}
          required
        />

        {/* Active / Inactive */}
        <label>Status *</label>
        <select
          name="is_active"
          value={newCourt.is_active}
          onChange={(e) =>
            setNewCourt((prev) => ({
              ...prev,
              is_active: e.target.value === "true"
            }))
          }
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* Actions */}
        <div className="modal-actions">
          <button type="submit" className="btn-primary">Save Court</button>
          <button type="button" className="btn-secondary" onClick={() => setShowCourtModal(false)}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <div>
              <h1>QuickCourt Analytics Dashboard</h1>
              <p>Comprehensive insights and performance analytics</p>
            </div>
            <div className="user-profile">
              <div className="profile-info">
                <img src={displayAvatar} alt={displayName} className="profile-avatar" />
                <div className="profile-details">
                  <div className="profile-name">{displayName}</div>
                  <div className="profile-email">{displayEmail}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <LogOut className="logout-icon" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-container">
              <Calendar className="metric-icon blue" />
            </div>
            <div className="metric-content">
              <div className="metric-label">Total Revenue</div>
              <div className="metric-value">₹{totalRevenue.toLocaleString()}</div>
              <div className="metric-change positive">+18% from last month</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-container">
              <Activity className="metric-icon orange" />
            </div>
            <div className="metric-content">
              <div className="metric-label">Avg Utilization</div>
              <div className="metric-value">{averageUtilization}%</div>
              <div className="metric-change neutral">+2% from last month</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-container">
              <Star className="metric-icon purple" />
            </div>
            <div className="metric-content">
              <div className="metric-label">Avg Rating</div>
              <div className="metric-value">{averageRating}</div>
              <div className="metric-change positive">+0.3 from last month</div>
            </div>
          </div>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <IconComponent className="tab-icon" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default OwnerHomePage;