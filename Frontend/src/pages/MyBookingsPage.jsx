import React, { useState } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import './MyBookingsPage.css';
import BookingDetailsModal from '../components/BookingDetailsModal';
import BookingEditModal from '../components/BookingEditModal';

const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editMode, setEditMode] = useState('edit'); // 'edit' or 'create'
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Sports-themed demo data
  const bookings = {
    upcoming: [
      {
        id: 1,
        sportName: 'Football',
        sportIcon: '',
        venueName: 'City Sports Arena',
        venueLocation: 'Downtown',
        venueImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=60',
        date: '2025-02-15',
        time: '06:30 PM - 08:00 PM',
        status: 'confirmed',
        bookingId: 'QC-FTB-0001',
        price_per_hour: '120.00',
        capacity: 10
      },
      {
        id: 2,
        sportName: 'Basketball',
        sportIcon: '',
        venueName: 'Skyline Courts',
        venueLocation: 'Uptown',
        venueImage: 'https://images.unsplash.com/photo-1518600506278-4e8ef466b810?w=800&auto=format&fit=crop&q=60',
        date: '2025-02-20',
        time: '07:00 PM - 09:00 PM',
        status: 'pending',
        bookingId: 'QC-BSK-0137',
        price_per_hour: '90.00',
        capacity: 8
      }
    ],
    past: [
      {
        id: 3,
        sportName: 'Tennis',
        sportIcon: '',
        venueName: 'Court Central',
        venueLocation: 'Central Park',
        venueImage: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=60',
        date: '2025-01-10',
        time: '05:00 PM - 06:00 PM',
        status: 'completed',
        bookingId: 'QC-TNS-0972',
        price_per_hour: '60.00',
        capacity: 4
      },
      {
        id: 4,
        sportName: 'Badminton',
        sportIcon: '',
        venueName: 'Riverside Club',
        venueLocation: 'Riverside',
        venueImage: 'https://images.unsplash.com/photo-1604908554027-783b2abf64f6?w=800&auto=format&fit=crop&q=60',
        date: '2025-01-05',
        time: '09:00 AM - 10:00 AM',
        status: 'completed',
        bookingId: 'QC-BDM-0239',
        price_per_hour: '45.00',
        capacity: 4
      }
    ],
    cancelled: [
      {
        id: 5,
        sportName: 'Football',
        sportIcon: '',
        venueName: 'Greenfield Grounds',
        venueLocation: 'Greenfield Ave',
        venueImage: 'https://images.unsplash.com/photo-1521417531039-96cce66f7d50?w=800&auto=format&fit=crop&q=60',
        date: '2025-01-25',
        time: '03:00 PM - 04:30 PM',
        status: 'cancelled',
        bookingId: 'QC-FTB-0190',
        cancellationReason: 'Weather conditions'
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10B981'; // green
      case 'pending': return '#F59E0B';   // amber
      case 'cancelled': return '#EF4444'; // red
      case 'completed': return '#6B7280'; // gray
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleViewDetails = (bookingId) => {
    const allBookings = [...bookings.upcoming, ...bookings.past, ...bookings.cancelled];
    const booking = allBookings.find(b => b.bookingId === bookingId);
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const handleEdit = (bookingId) => {
    const allBookings = [...bookings.upcoming, ...bookings.past, ...bookings.cancelled];
    const booking = allBookings.find(b => b.bookingId === bookingId);
    setSelectedBooking(booking);
    setEditMode('edit');
    setShowEdit(true);
  };

  const handleCreate = () => {
    setSelectedBooking(null);
    setEditMode('create');
    setShowEdit(true);
  };

  const handleSaveBooking = (fields) => {
    // For now, just close modal. Integrate API later.
    setShowEdit(false);
    setSelectedBooking(null);
    // Optionally update demo data here
  };

  const handleCancel = (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      alert(`Cancel request submitted for ${bookingId}`);
    }
  };

  return (
    <div className="my-bookings-page">
      <Header showNavigation />
      <div className="bookings-container fade-in">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <Button variant="primary" size="medium" onClick={handleCreate} style={{ background: '#6B5B95' }}>
            + Create New Booking
          </Button>
        </div>
        {/* <div className="bookings-header">
          <h1>My Sports Bookings</h1>
          <p>Track, edit, and manage your QuickCourt reservations</p>
        </div> */}

        <div className="bookings-tabs">
          <button
            className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({bookings.upcoming.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past ({bookings.past.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled ({bookings.cancelled.length})
          </button>
        </div>

        <div className="bookings-content">
          {bookings[activeTab].length === 0 ? (
            <div className="no-bookings">
              <p>No {activeTab} bookings found.</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings[activeTab].map((b) => (
                <div key={b.id} className="booking-card">
                  <div className="booking-header">
                    <div className="venue-info">
                      <img src={b.venueImage} alt={b.venueName} className="venue-thumbnail" />
                      <div>
                        <div className="sport-row">
                          <span className="sport-pill">{b.sportName}</span>
                          <span className="status-badge" style={{ backgroundColor: getStatusColor(b.status) }}>
                            {getStatusText(b.status)}
                          </span>
                        </div>
                        <h3>{b.venueName}</h3>
                        <p className="venue-location">{b.venueLocation}</p>
                        <p className="booking-id">#{b.bookingId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="detail-label">Price per hour</span>
                      <span className="detail-value">${b.price_per_hour}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Date</span>
                      <span className="detail-value">{new Date(b.date).toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                      })}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Time</span>
                      <span className="detail-value">{b.time}</span>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <Button variant="outline" size="small" onClick={() => handleViewDetails(b.bookingId)}>View Details</Button>
                    <Button variant="secondary" size="small" onClick={() => handleEdit(b.bookingId)}>Edit</Button>
                    <Button variant="primary" size="small" onClick={() => handleCancel(b.bookingId)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showDetails && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setShowDetails(false)}
        />
      )}
      {showEdit && (
        <BookingEditModal
          booking={selectedBooking}
          mode={editMode}
          onSave={handleSaveBooking}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
};

export default MyBookingsPage;
