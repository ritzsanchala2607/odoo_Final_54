import React, { useState } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import BookingDetailsModal from '../components/BookingDetailsModal';
import BookingEditModal from '../components/BookingEditModal';
import './MyBookingsPage.css';

const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // Sports-themed demo data
  const bookings = {
    upcoming: [
      {
        id: 1,
        sportName: 'Football',
        sportIcon: '⚽️',
        venueName: 'City Sports Arena',
        venueLocation: 'Downtown',
        venueImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=60',
        date: '2025-02-15',
        time: '06:30 PM - 08:00 PM',
        status: 'confirmed',
        bookingId: 'QC-FTB-0001',
        courtType: 'Turf',
        people: 10,
        totalAmount: '$50'
      },
      {
        id: 2,
        sportName: 'Basketball',
        sportIcon: '🏀',
        venueName: 'Skyline Courts',
        venueLocation: 'Uptown',
        venueImage: 'https://images.unsplash.com/photo-1518600506278-4e8ef466b810?w=800&auto=format&fit=crop&q=60',
        date: '2025-02-20',
        time: '07:00 PM - 09:00 PM',
        status: 'pending',
        bookingId: 'QC-BSK-0137',
        courtType: 'Indoor',
        people: 8,
        totalAmount: '$40'
      }
    ],
    past: [
      {
        id: 3,
        sportName: 'Tennis',
        sportIcon: '🎾',
        venueName: 'Court Central',
        venueLocation: 'Central Park',
        venueImage: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=60',
        date: '2025-01-10',
        time: '05:00 PM - 06:00 PM',
        status: 'completed',
        bookingId: 'QC-TNS-0972',
        courtType: 'Hard',
        people: 2,
        totalAmount: '$20'
      },
      {
        id: 4,
        sportName: 'Badminton',
        sportIcon: '🏸',
        venueName: 'Riverside Club',
        venueLocation: 'Riverside',
        venueImage: 'https://images.unsplash.com/photo-1604908554027-783b2abf64f6?w=800&auto=format&fit=crop&q=60',
        date: '2025-01-05',
        time: '09:00 AM - 10:00 AM',
        status: 'completed',
        bookingId: 'QC-BDM-0239',
        courtType: 'Indoor',
        people: 4,
        totalAmount: '$15'
      }
    ],
    cancelled: [
      {
        id: 5,
        sportName: 'Football',
        sportIcon: '⚽️',
        venueName: 'Greenfield Grounds',
        venueLocation: 'Greenfield Ave',
        venueImage: 'https://images.unsplash.com/photo-1521417531039-96cce66f7d50?w=800&auto=format&fit=crop&q=60',
        date: '2025-01-25',
        time: '03:00 PM - 04:30 PM',
        status: 'cancelled',
        bookingId: 'QC-FTB-0190',
        courtType: 'Turf',
        people: 12,
        totalAmount: '$0',
        cancellationReason: 'Weather conditions'
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      case 'completed': return '#6B7280';
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

  const openDetails = (b) => { setSelected(b); setDetailsOpen(true); };
  const openEdit = (b) => { setSelected(b); setEditOpen(true); };

  const handleSaveEdit = (updated) => {
    // In real app, call API; for now just log and close
    console.log('Save booking', updated);
    setEditOpen(false);
  };

  const handleCreateNew = () => {
    // Open empty edit with defaults
    openEdit({
      bookingId: 'NEW',
      sportName: '', sportIcon: '', venueName: '', venueLocation: '',
      start_at: '', end_at: '', status: 'pending', total_amount: '', courtType: '', people: ''
    });
  };

  return (
    <div className="my-bookings-page">
      <Header showNavigation />
      <div className="bookings-container fade-in">
        {/* Header hidden per user's change; keep actions bar below */}
        <div className="actions-bar">
          <h1 className="page-title">My Sports Bookings</h1>
          <Button variant="primary" onClick={handleCreateNew}>Create New Booking</Button>
        </div>

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
                          <span className="sport-pill"><span className="sport-icon">{b.sportIcon}</span>{b.sportName}</span>
                          <span className="status-badge" style={{ backgroundColor: getStatusColor(b.status) }}>
                            {getStatusText(b.status)}
                          </span>
                        </div>
                        <h3>{b.venueName}</h3>
                        <p className="venue-location">📍 {b.venueLocation}</p>
                        <p className="booking-id">#{b.bookingId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="detail-label">📅 Date</span>
                      <span className="detail-value">{new Date(b.date).toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                      })}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">🕒 Time</span>
                      <span className="detail-value">{b.time}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Court Type</span>
                      <span className="detail-value">{b.courtType}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">People</span>
                      <span className="detail-value">{b.people}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Price</span>
                      <span className="detail-value">{b.totalAmount}</span>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <Button variant="outline" size="small" onClick={() => openDetails(b)}>View Details</Button>
                    <Button variant="secondary" size="small" onClick={() => openEdit(b)}>Edit</Button>
                    <Button variant="primary" size="small" onClick={() => alert('Cancel flow coming soon')}>Cancel</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BookingDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} booking={selected} />
      <BookingEditModal open={editOpen} onClose={() => setEditOpen(false)} initial={selected} onSave={handleSaveEdit} />
    </div>
  );
};

export default MyBookingsPage;
