import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import Avatar from '../components/Avatar';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, refreshUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    location: '',
    bio: '',
    avatar: ''
  });
  const [editData, setEditData] = useState({ ...profileData });
  const [bookings, setBookings] = useState([]);

  // Fetch user profile data when component mounts
  useEffect(() => {
    if (user) {
      const userProfile = {
        fullName: user.full_name || 'User',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        position: user.position || '',
        location: user.location || '',
        bio: user.short_bio || '',
        avatar: getAvatarUrl(user.avatar_url)
      };
      setProfileData(userProfile);
      setEditData(userProfile);
      setIsLoading(false);
    }
  }, [user]);

  // Mock API Call for Bookings
  useEffect(() => {
    const fetchBookings = async () => {
      const data = [
        { id: 1, venueName: 'Grand Conference Center', date: '2024-02-15', status: 'confirmed' },
        { id: 2, venueName: 'Skyline Meeting Room', date: '2024-02-20', status: 'confirmed' },
        { id: 3, venueName: 'Tech Auditorium', date: '2024-01-10', status: 'completed' },
        { id: 4, venueName: 'City Hall Event Space', date: '2023-12-05', status: 'deleted' },
        { id: 5, venueName: 'Modern Banquet Hall', date: '2024-03-02', status: 'deleted' }
      ];
      setBookings(data);
    };
    fetchBookings();
  }, []);

  const getAvatarUrl = (avatarUrl) => {
    if (avatarUrl) {
      // If avatar_url starts with '/', it's a relative path, otherwise it's a full URL
      if (avatarUrl.startsWith('/')) {
        return `${import.meta.env.VITE_BACKEND_URL}${avatarUrl}`;
      }
      return avatarUrl;
    }
    // Fallback to default avatar
    return '../assets/user_img.png';
  };

  const handleAvatarError = (e) => {
    // If user's avatar fails to load, fallback to default
    e.target.src = '../assets/user_img.png';
  };

  // Show loading state if user data is not yet available
  if (isLoading || !user) {
    return (
      <div className="profile-page">
        <Header showNavigation />
        <div className="profile-container fade-in">
          <div className="loading-state">
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Here you would typically make an API call to update the user profile
      // For now, we'll just update the local state and refresh user data
      setProfileData(editData);
      setIsEditing(false);
      
      // Refresh user data to ensure we have the latest information
      if (refreshUserData) {
        await refreshUserData();
      }
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Booking filters
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const deletedBookings = bookings.filter(b => b.status === 'deleted');
  const recentBookings = bookings.slice(0, 3);

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: '📅' },
    { label: 'Confirmed', value: confirmedBookings.length, icon: '✅' },
    { label: 'Deleted', value: deletedBookings.length, icon: '🗑️' },
    { label: 'Member Since', value: '2022', icon: '🎯' }
  ];

  return (
    <div className="profile-page">
      <Header showNavigation />
      <div className="profile-container fade-in">
        {/* HEADER */}
        <div className="profile-header">
          <div className="profile-cover">
            <div className="profile-avatar-section">
              <Avatar 
                src={isEditing ? editData.avatar : profileData.avatar}
                size="large"
                alt={profileData.fullName}
                onError={handleAvatarError}
              />
              {isEditing && (
                <label className="avatar-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <span>📷</span>
                </label>
              )}
            </div>
            <div className="profile-info">
              <h1>{isEditing ? editData.fullName : profileData.fullName}</h1>
              <p className="profile-position">
                {isEditing ? editData.position : profileData.position} at {isEditing ? editData.company : profileData.company}
              </p>
              <p className="profile-location">📍 {isEditing ? editData.location : profileData.location}</p>
              <div className="profile-actions">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="primary">
                    Edit Profile
                  </Button>
                ) : (
                  <div className="edit-actions">
                    <Button onClick={handleSave} variant="primary">
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="secondary">
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="profile-content">
          {/* MAIN SECTION */}
          <div className="profile-main">
            {/* PERSONAL INFO */}
            <div className="profile-section">
              <h2>Personal Information</h2>
              {!isEditing ? (
                <div className="info-grid">
                  <div className="info-item"><span className="info-label">Full Name</span><span className="info-value">{profileData.fullName}</span></div>
                  <div className="info-item"><span className="info-label">Email</span><span className="info-value">{profileData.email}</span></div>
                  <div className="info-item"><span className="info-label">Phone</span><span className="info-value">{profileData.phone}</span></div>
                  <div className="info-item"><span className="info-label">Company</span><span className="info-value">{profileData.company}</span></div>
                  <div className="info-item"><span className="info-label">Position</span><span className="info-value">{profileData.position}</span></div>
                  <div className="info-item"><span className="info-label">Location</span><span className="info-value">{profileData.location}</span></div>
                </div>
              ) : (
                <div className="edit-form">
                  <div className="form-row">
                    <div className="form-group"><label>Full Name</label><Input name="fullName" value={editData.fullName} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Email</label><Input name="email" type="email" value={editData.email} onChange={handleInputChange} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Phone</label><Input name="phone" value={editData.phone} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Company</label><Input name="company" value={editData.company} onChange={handleInputChange} /></div>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Position</label><Input name="position" value={editData.position} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Location</label><Input name="location" value={editData.location} onChange={handleInputChange} /></div>
                  </div>
                </div>
              )}
            </div>

            {/* ABOUT ME */}
            <div className="profile-section">
              <h2>About Me</h2>
              {!isEditing ? (
                <p className="bio-text">{profileData.bio}</p>
              ) : (
                <div className="form-group">
                  <label>Bio</label>
                  <textarea name="bio" value={editData.bio} onChange={handleInputChange} rows={4} className="bio-textarea" placeholder="Tell us about yourself..." />
                </div>
              )}
            </div>

            {/* CONFIRMED BOOKINGS */}
            <div className="profile-section">
              <h2>Confirmed Bookings</h2>
              {confirmedBookings.length > 0 ? confirmedBookings.map(b => (
                <div key={b.id} className="recent-booking-item">
                  <div className="booking-info">
                    <h4>{b.venueName}</h4>
                    <p>{new Date(b.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`status-dot ${b.status}`}></span>
                </div>
              )) : <p>No confirmed bookings.</p>}
            </div>

            {/* DELETED BOOKINGS */}
            <div className="profile-section">
              <h2>Deleted Bookings</h2>
              {deletedBookings.length > 0 ? deletedBookings.map(b => (
                <div key={b.id} className="recent-booking-item">
                  <div className="booking-info">
                    <h4>{b.venueName}</h4>
                    <p>{new Date(b.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`status-dot ${b.status}`}></span>
                </div>
              )) : <p>No deleted bookings.</p>}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="profile-sidebar">
            <div className="stats-section">
              <h3>Your Stats</h3>
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <span className="stat-icon">{stat.icon}</span>
                    <div className="stat-content">
                      <span className="stat-value">{stat.value}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="recent-bookings-section">
              <h3>Recent Bookings</h3>
              <div className="bookings-list">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="recent-booking-item">
                    <div className="booking-info">
                      <h4>{booking.venueName}</h4>
                      <p>{new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`status-dot ${booking.status}`}></span>
                  </div>
                ))}
              </div>
              <Button variant="secondary" fullWidth>View All Bookings</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
