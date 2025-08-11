import React, { useState } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import './MyBookingsPage.css';

const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const bookings = {
    upcoming: [
      {
        id: 1,
        venueName: 'Grand Conference Center',
        venueImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
        date: '2024-02-15',
        time: '09:00 AM - 05:00 PM',
        status: 'confirmed',
        bookingId: 'BK-2024-001',
        totalAmount: '$1,600',
        attendees: 80,
        purpose: 'Annual Team Meeting'
      },
      {
        id: 2,
        venueName: 'Skyline Meeting Room',
        venueImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop',
        date: '2024-02-20',
        time: '02:00 PM - 04:00 PM',
        status: 'confirmed',
        bookingId: 'BK-2024-002',
        totalAmount: '$160',
        attendees: 25,
        purpose: 'Client Presentation'
      }
    ],
    past: [
      {
        id: 3,
        venueName: 'Tech Auditorium',
        venueImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
        date: '2024-01-10',
        time: '10:00 AM - 12:00 PM',
        status: 'completed',
        bookingId: 'BK-2024-003',
        totalAmount: '$240',
        attendees: 150,
        purpose: 'Product Launch Event'
      },
      {
        id: 4,
        venueName: 'Garden Pavilion',
        venueImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
        date: '2024-01-05',
        time: '06:00 PM - 10:00 PM',
        status: 'completed',
        bookingId: 'BK-2024-004',
        totalAmount: '$400',
        attendees: 80,
        purpose: 'Company Dinner'
      }
    ],
    cancelled: [
      {
        id: 5,
        venueName: 'Riverside Event Space',
        venueImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
        date: '2024-01-25',
        time: '03:00 PM - 06:00 PM',
        status: 'cancelled',
        bookingId: 'BK-2024-005',
        totalAmount: '$450',
        attendees: 100,
        purpose: 'Team Building Event',
        cancellationReason: 'Weather conditions'
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      case 'completed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return '✅ Confirmed';
      case 'pending': return '⏳ Pending';
      case 'cancelled': return '❌ Cancelled';
      case 'completed': return '✅ Completed';
      default: return status;
    }
  };

  const handleCancelBooking = (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      console.log(`Cancelling booking ${bookingId}`);
      alert('Booking cancellation request sent. You will receive a confirmation email shortly.');
    }
  };

  const handleRescheduleBooking = (bookingId) => {
    console.log(`Rescheduling booking ${bookingId}`);
    alert('Reschedule request sent. Our team will contact you to arrange a new date.');
  };

  const handleDownloadInvoice = (bookingId) => {
    console.log(`Downloading invoice for ${bookingId}`);
    alert('Invoice download started. Check your downloads folder.');
  };

  return (
    <div className="my-bookings-page">
      <Header showNavigation />
      <div className="bookings-container fade-in">
        <div className="bookings-header">
          <h1>My Bookings</h1>
          <p>Manage and track all your venue reservations</p>
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
              {bookings[activeTab].map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div className="venue-info">
                      <img src={booking.venueImage} alt={booking.venueName} className="venue-thumbnail" />
                      <div>
                        <h3>{booking.venueName}</h3>
                        <p className="booking-id">#{booking.bookingId}</p>
                      </div>
                    </div>
                    <div 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="detail-label">📅 Date:</span>
                      <span className="detail-value">{new Date(booking.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">🕐 Time:</span>
                      <span className="detail-value">{booking.time}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">👥 Attendees:</span>
                      <span className="detail-value">{booking.attendees} people</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">🎯 Purpose:</span>
                      <span className="detail-value">{booking.purpose}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">💰 Total Amount:</span>
                      <span className="detail-value amount">{booking.totalAmount}</span>
                    </div>
                    {booking.cancellationReason && (
                      <div className="detail-row">
                        <span className="detail-label">❌ Cancellation Reason:</span>
                        <span className="detail-value">{booking.cancellationReason}</span>
                      </div>
                    )}
                  </div>

                  <div className="booking-actions">
                    {activeTab === 'upcoming' && (
                      <>
                        <Button 
                          onClick={() => handleRescheduleBooking(booking.bookingId)}
                          variant="secondary"
                          size="small"
                        >
                          Reschedule
                        </Button>
                        <Button 
                          onClick={() => handleCancelBooking(booking.bookingId)}
                          variant="secondary"
                          size="small"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {activeTab === 'past' && (
                      <Button 
                        onClick={() => handleDownloadInvoice(booking.bookingId)}
                        variant="secondary"
                        size="small"
                      >
                        Download Invoice
                      </Button>
                    )}
                    {activeTab === 'cancelled' && (
                      <Button 
                        onClick={() => handleDownloadInvoice(booking.bookingId)}
                        variant="secondary"
                        size="small"
                      >
                        Download Invoice
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
