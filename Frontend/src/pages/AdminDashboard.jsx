import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, MapPin, Calendar, AlertTriangle, TrendingUp, Activity, Building, DollarSign, CheckCircle, XCircle, Plus, Edit, Trash2, Eye } from 'lucide-react';
import './Dashboard.css';

const AdminDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [showVenueApprovalModal, setShowVenueApprovalModal] = useState(false);
  const [showCourtModal, setShowCourtModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [pendingVenues, setPendingVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [loadingCourts, setLoadingCourts] = useState(false);
  const [courts, setCourts] = useState([]);
  const [editingCourt, setEditingCourt] = useState(null);
  const [showCourtForm, setShowCourtForm] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Mock data
  const cityWiseData = [
    { name: 'Mumbai', value: 35, bookings: 1250, revenue: 87500 },
    { name: 'Delhi', value: 25, bookings: 890, revenue: 62300 },
    { name: 'Bangalore', value: 20, bookings: 720, revenue: 50400 },
    { name: 'Chennai', value: 12, bookings: 430, revenue: 30100 },
    { name: 'Pune', value: 8, bookings: 290, revenue: 20300 }
  ];

  const gameWiseEarnings = [
    { name: 'Badminton', value: 40, earnings: 142000, courts: 45 },
    { name: 'Tennis', value: 25, earnings: 89250, courts: 28 },
    { name: 'Football Turf', value: 20, earnings: 71400, courts: 15 },
    { name: 'Basketball', value: 10, earnings: 35700, courts: 12 },
    { name: 'Cricket Net', value: 5, earnings: 17850, courts: 8 }
  ];

  const suspiciousActivities = [
    { id: 1, type: 'Multiple bookings', user: 'user_12345', venue: 'Sports Hub Mumbai', time: '2 hours ago', severity: 'high' },
    { id: 2, type: 'Payment anomaly', user: 'user_67890', venue: 'Court Master Delhi', time: '4 hours ago', severity: 'medium' },
    { id: 3, type: 'Unusual login pattern', user: 'user_54321', venue: 'N/A', time: '6 hours ago', severity: 'low' },
    { id: 4, type: 'Fake reviews detected', user: 'user_98765', venue: 'Elite Sports Bangalore', time: '1 day ago', severity: 'high' },
    { id: 5, type: 'Account verification issue', user: 'user_11111', venue: 'N/A', time: '2 days ago', severity: 'medium' }
  ];

  const weeklyTrends = [
    { day: 'Mon', bookings: 120, revenue: 8400 },
    { day: 'Tue', bookings: 135, revenue: 9450 },
    { day: 'Wed', bookings: 165, revenue: 11550 },
    { day: 'Thu', bookings: 180, revenue: 12600 },
    { day: 'Fri', bookings: 220, revenue: 15400 },
    { day: 'Sat', bookings: 280, revenue: 19600 },
    { day: 'Sun', bookings: 250, revenue: 17500 }
  ];

  const statsCards = [
    { title: 'Active Users', value: '12,486', change: '+12%', icon: Users, color: 'blue' },
    { title: 'Active Venues', value: '340', change: '+8%', icon: Building, color: 'teal' },
    { title: 'Active Courts', value: '1,247', change: '+15%', icon: MapPin, color: 'purple' },
    { title: 'Today\'s Revenue', value: '₹45,280', change: '+23%', icon: DollarSign, color: 'orange' }
  ];

  const COLORS = ['#14B8A6', '#8B5CF6', '#F59E0B', '#EF4444', '#3B82F6'];

  // Fetch initial pending venues count
  useEffect(() => {
    fetchPendingVenues();
  }, []);

  // Fetch pending venues when modal opens
  useEffect(() => {
    if (showVenueApprovalModal) {
      fetchPendingVenues();
    }
  }, [showVenueApprovalModal]);

  const handleTimeRangeChange = (range) => {
    setIsLoading(true);
    setSelectedTimeRange(range);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  // Fetch pending venues
  const fetchPendingVenues = async () => {
    setLoadingVenues(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/venues?status=pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setPendingVenues(result.rows || result || []);
      } else {
        console.error('Failed to fetch pending venues');
      }
    } catch (error) {
      console.error('Error fetching pending venues:', error);
    } finally {
      setLoadingVenues(false);
    }
  };

  // Fetch venue with courts
  const fetchVenueWithCourts = async (venueId) => {
    setLoadingCourts(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/venues/${venueId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setSelectedVenue(result.venue);
        setCourts(result.venue.courts || []);
        setShowCourtModal(true);
      } else {
        console.error('Failed to fetch venue details');
      }
    } catch (error) {
      console.error('Error fetching venue details:', error);
    } finally {
      setLoadingCourts(false);
    }
  };

  // Approve venue
  const approveVenue = async (venueId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/venues/${venueId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'approved' })
      });

      if (response.ok) {
        alert('Venue approved successfully!');
        fetchPendingVenues(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Error approving venue: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error approving venue:', error);
      alert('Failed to approve venue. Please try again.');
    }
  };

  // Reject venue
  const rejectVenue = async (venueId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/venues/${venueId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: 'rejected',
          decision_notes: reason
        })
      });

      if (response.ok) {
        alert('Venue rejected successfully!');
        fetchPendingVenues(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Error rejecting venue: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error rejecting venue:', error);
      alert('Failed to reject venue. Please try again.');
    }
  };

  // Court CRUD operations
  const createCourt = async (courtData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/courts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...courtData,
          venue_id: selectedVenue.id
        })
      });

      if (response.ok) {
        alert('Court created successfully!');
        fetchVenueWithCourts(selectedVenue.id); // Refresh courts list
        setShowCourtForm(false);
        setEditingCourt(null);
      } else {
        const error = await response.json();
        alert(`Error creating court: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating court:', error);
      alert('Failed to create court. Please try again.');
    }
  };

  const updateCourt = async (courtId, courtData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courts/${courtId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courtData)
      });

      if (response.ok) {
        alert('Court updated successfully!');
        fetchVenueWithCourts(selectedVenue.id); // Refresh courts list
        setShowCourtForm(false);
        setEditingCourt(null);
      } else {
        const error = await response.json();
        alert(`Error updating court: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating court:', error);
      alert('Failed to update court. Please try again.');
    }
  };

  const deleteCourt = async (courtId) => {
    if (!confirm('Are you sure you want to delete this court?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courts/${courtId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Court deleted successfully!');
        fetchVenueWithCourts(selectedVenue.id); // Refresh courts list
      } else {
        const error = await response.json();
        alert(`Error deleting court: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting court:', error);
      alert('Failed to delete court. Please try again.');
    }
  };

  const handleCourtSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const courtData = {
      name: formData.get('name'),
      sport_type: formData.get('sport_type'),
      price_per_hour: parseFloat(formData.get('price_per_hour')),
      price_per_person: parseFloat(formData.get('price_per_person')) || null,
      capacity: parseInt(formData.get('capacity')),
      allow_per_hour: formData.get('allow_per_hour') === 'true',
      allow_per_person: formData.get('allow_per_person') === 'true'
    };

    if (editingCourt) {
      updateCourt(editingCourt.id, courtData);
    } else {
      createCourt(courtData);
    }
  };

  const openEditCourt = (court) => {
    setEditingCourt(court);
    setShowCourtForm(true);
  };

  const openCreateCourt = () => {
    setEditingCourt(null);
    setShowCourtForm(true);
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="brand-section">
            <div className="brand-logo">Q</div>
            <div>
              <h1>QuickCourt Admin</h1>
              <p>Manage your sports facility booking platform</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              className="get-started-btn"
              onClick={() => setShowVenueApprovalModal(true)}
            >
              Pending Venues ({pendingVenues.length})
            </button>
            <button
              className="get-started-btn"
              onClick={() => navigate('/home')}
            >
              Go to App
            </button>
            <button
              className="logout-btn"
              onClick={async () => { await logout(); navigate('/login'); }}
            >
              Logout
            </button>
          </div>
          <div className="time-range-selector">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                className={`time-btn ${selectedTimeRange === range ? 'active' : ''}`}
                onClick={() => handleTimeRangeChange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          {statsCards.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-info">
                <p className="stat-title">{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
                <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* City-wise Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>City-wise Distribution</h3>
              <div className="chart-info">
                <Activity size={16} />
                <span>Booking Ratio</span>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={cityWiseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {cityWiseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [
                    `${value}% (${props.payload.bookings} bookings)`,
                    'Share'
                  ]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              {cityWiseData.slice(0, 4).map((item, index) => (
                <div key={item.name} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{item.name}: ₹{item.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Game-wise Earnings */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Game-wise Earnings</h3>
              <div className="chart-info">
                <TrendingUp size={16} />
                <span>Revenue Share</span>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={gameWiseEarnings}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#82ca9d"
                    dataKey="value"
                  >
                    {gameWiseEarnings.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [
                    `₹${props.payload.earnings.toLocaleString()} (${props.payload.courts} courts)`,
                    'Earnings'
                  ]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              {gameWiseEarnings.slice(0, 4).map((item, index) => (
                <div key={item.name} className="legend-item">
                  <div 
                    className="legend-color" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{item.name}: ₹{item.earnings.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Trends */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Weekly Booking Trends</h3>
            <div className="chart-info">
              <Calendar size={16} />
              <span>Last 7 Days</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#14B8A6" 
                  strokeWidth={3}
                  name="Bookings"
                  dot={{ fill: '#14B8A6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  name="Revenue (₹)"
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Suspicious Activities */}
        <div className="activity-section">
          <div className="section-header">
            <h3>
              <AlertTriangle size={20} />
              Recent Suspicious Activities
            </h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activity-list">
            {suspiciousActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-indicator">
                  <div 
                    className="severity-dot"
                    style={{ backgroundColor: getSeverityColor(activity.severity) }}
                  ></div>
                </div>
                <div className="activity-content">
                  <div className="activity-main">
                    <span className="activity-type">{activity.type}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <div className="activity-details">
                    <span>User: {activity.user}</span>
                    {activity.venue !== 'N/A' && (
                      <>
                        <span className="separator">•</span>
                        <span>Venue: {activity.venue}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="activity-actions">
                  <button className="action-btn investigate">Investigate</button>
                  <button className="action-btn dismiss">Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Venue Approval Modal */}
        {showVenueApprovalModal && (
          <div className="modal-overlay">
            <div className="modal-content venue-approval-modal">
              <div className="modal-header">
                <h2>Pending Venue Approvals</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowVenueApprovalModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                {loadingVenues ? (
                  <div className="loading-spinner">Loading...</div>
                ) : pendingVenues.length === 0 ? (
                  <div className="no-venues">
                    <p>No pending venue approvals</p>
                  </div>
                ) : (
                  <div className="venues-list">
                    {pendingVenues.map((venue) => (
                      <div key={venue.id} className="venue-item">
                        <div className="venue-info">
                          <h3>{venue.name}</h3>
                          <p className="venue-owner">Owner: {venue.owner?.full_name || venue.owner?.email || 'Unknown'}</p>
                          <p className="venue-location">{venue.address}, {venue.city}</p>
                          <p className="venue-description">{venue.description}</p>
                          <p className="venue-price">Starting Price: ₹{venue.starting_price}</p>
                          
                          {/* Enhanced Court Information */}
                          <div className="venue-courts-info">
                            <p className="venue-courts">
                              Courts: {(venue.courts?.length ?? 0)}/{venue.max_courts ?? '—'}
                            </p>
                            <p className="venue-courts-count">
                              <strong>Courts:</strong> {venue.capacityInfo?.totalCourtsActive ?? 0}/{venue.capacityInfo?.totalCourtsAll ?? 0}
                            </p>
                            <p className="venue-capacity">
                              <strong>Total Capacity:</strong> {venue.capacityInfo?.totalCapacityActive ?? 0}/{venue.capacityInfo?.totalCapacityAll ?? 0} people
                            </p>
                            {venue.capacityInfo?.courtTypes?.length ? (
                              <p className="venue-sports">
                                Sports: {venue.capacityInfo.courtTypes.join(', ')}
                              </p>
                            ) : null}
                            {venue.capacityInfo?.averagePrice > 0 ? (
                              <p className="venue-avg-price">
                                Avg. Price: ₹{venue.capacityInfo.averagePrice}/hour
                              </p>
                            ) : null}
                          </div>
                          
                          <p className="venue-date">Submitted: {new Date(venue.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="venue-actions">
                          <button 
                            className="view-courts-btn"
                            onClick={() => fetchVenueWithCourts(venue.id)}
                          >
                            <Eye size={16} />
                            View Courts
                          </button>
                          <button 
                            className="approve-btn"
                            onClick={() => approveVenue(venue.id)}
                          >
                            <CheckCircle size={16} />
                            Approve
                          </button>
                          <button 
                            className="reject-btn"
                            onClick={() => rejectVenue(venue.id)}
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Court Management Modal */}
        {showCourtModal && selectedVenue && (
          <div className="modal-overlay">
            <div className="modal-content court-management-modal">
              <div className="modal-header">
                <h2>Courts - {selectedVenue.name}</h2>
                <button 
                  className="close-btn"
                  onClick={() => {
                    setShowCourtModal(false);
                    setSelectedVenue(null);
                    setCourts([]);
                    setShowCourtForm(false);
                    setEditingCourt(null);
                  }}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="venue-summary">
                  <p><strong>Owner:</strong> {selectedVenue.owner?.full_name || selectedVenue.owner?.email}</p>
                  <p><strong>Location:</strong> {selectedVenue.address}, {selectedVenue.city}</p>
                  <p><strong>Status:</strong> <span className={`status-${selectedVenue.status}`}>{selectedVenue.status}</span></p>
                </div>

                <div className="courts-header">
                  <h3>Courts ({courts.length})</h3>
                  <button 
                    className="add-court-btn"
                    onClick={openCreateCourt}
                  >
                    <Plus size={16} />
                    Add Court
                  </button>
                </div>

                {loadingCourts ? (
                  <div className="loading-spinner">Loading courts...</div>
                ) : courts.length === 0 ? (
                  <div className="no-courts">
                    <p>No courts defined for this venue</p>
                  </div>
                ) : (
                  <div className="courts-list">
                    {courts.map((court) => (
                      <div key={court.id} className="court-item">
                        <div className="court-info">
                          <h4>{court.name}</h4>
                          <p><strong>Sport:</strong> {court.sport_type}</p>
                          <p><strong>Price per hour:</strong> ₹{court.price_per_hour}</p>
                          {court.price_per_person && (
                            <p><strong>Price per person:</strong> ₹{court.price_per_person}</p>
                          )}
                          <p><strong>Capacity:</strong> {court.capacity} people</p>
                          <p><strong>Status:</strong> <span className={`status-${court.is_active ? 'active' : 'inactive'}`}>
                            {court.is_active ? 'Active' : 'Inactive'}
                          </span></p>
                        </div>
                        <div className="court-actions">
                          <button 
                            className="edit-btn"
                            onClick={() => openEditCourt(court)}
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => deleteCourt(court.id)}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Court Form Modal */}
                {showCourtForm && (
                  <div className="modal-overlay court-form-overlay">
                    <div className="modal-content court-form-modal">
                      <div className="modal-header">
                        <h3>{editingCourt ? 'Edit Court' : 'Add New Court'}</h3>
                        <button 
                          className="close-btn"
                          onClick={() => {
                            setShowCourtForm(false);
                            setEditingCourt(null);
                          }}
                        >
                          ×
                        </button>
                      </div>
                      
                      <div className="modal-body">
                        <form onSubmit={handleCourtSubmit} className="court-form">
                          <div className="form-group">
                            <label htmlFor="name">Court Name *</label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              defaultValue={editingCourt?.name || ''}
                              required
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="sport_type">Sport Type *</label>
                            <select
                              id="sport_type"
                              name="sport_type"
                              defaultValue={editingCourt?.sport_type || ''}
                              required
                            >
                              <option value="">Select Sport</option>
                              <option value="Badminton">Badminton</option>
                              <option value="Tennis">Tennis</option>
                              <option value="Football">Football</option>
                              <option value="Basketball">Basketball</option>
                              <option value="Cricket">Cricket</option>
                              <option value="Table Tennis">Table Tennis</option>
                              <option value="Squash">Squash</option>
                              <option value="Volleyball">Volleyball</option>
                            </select>
                          </div>
                          
                          <div className="form-row">
                            <div className="form-group">
                              <label htmlFor="price_per_hour">Price per Hour (₹) *</label>
                              <input
                                type="number"
                                id="price_per_hour"
                                name="price_per_hour"
                                min="0"
                                step="0.01"
                                defaultValue={editingCourt?.price_per_hour || ''}
                                required
                              />
                            </div>
                            
                            <div className="form-group">
                              <label htmlFor="price_per_person">Price per Person (₹)</label>
                              <input
                                type="number"
                                id="price_per_person"
                                name="price_per_person"
                                min="0"
                                step="0.01"
                                defaultValue={editingCourt?.price_per_person || ''}
                              />
                            </div>
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="capacity">Capacity (people) *</label>
                            <input
                              type="number"
                              id="capacity"
                              name="capacity"
                              min="1"
                              defaultValue={editingCourt?.capacity || 1}
                              required
                            />
                          </div>
                          
                          <div className="form-row">
                            <div className="form-group checkbox-group">
                              <label>
                                <input
                                  type="checkbox"
                                  name="allow_per_hour"
                                  value="true"
                                  defaultChecked={editingCourt?.allow_per_hour !== false}
                                />
                                Allow per hour booking
                              </label>
                            </div>
                            
                            <div className="form-group checkbox-group">
                              <label>
                                <input
                                  type="checkbox"
                                  name="allow_per_person"
                                  value="true"
                                  defaultChecked={editingCourt?.allow_per_person === true}
                                />
                                Allow per person booking
                              </label>
                            </div>
                          </div>
                          
                          <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => {
                              setShowCourtForm(false);
                              setEditingCourt(null);
                            }}>
                              Cancel
                            </button>
                            <button type="submit" className="submit-btn">
                              {editingCourt ? 'Update Court' : 'Create Court'}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <span>Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;