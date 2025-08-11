import React, { useState, useEffect } from 'react';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose, venue, onBookingConfirm }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [memberCount, setMemberCount] = useState(1);
  const [selectedSport, setSelectedSport] = useState('');
  const [bookingDetails, setBookingDetails] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });

  // Generate available time slots
  const timeSlots = [
    { id: '07:00-08:00', time: '7:00 AM - 8:00 AM', price: 500 },
    { id: '08:00-09:00', time: '8:00 AM - 9:00 AM', price: 500 },
    { id: '09:00-10:00', time: '9:00 AM - 10:00 AM', price: 600 },
    { id: '10:00-11:00', time: '10:00 AM - 11:00 AM', price: 600 },
    { id: '11:00-12:00', time: '11:00 AM - 12:00 PM', price: 700 },
    { id: '12:00-13:00', time: '12:00 PM - 1:00 PM', price: 700 },
    { id: '13:00-14:00', time: '1:00 PM - 2:00 PM', price: 700 },
    { id: '14:00-15:00', time: '2:00 PM - 3:00 PM', price: 700 },
    { id: '15:00-16:00', time: '3:00 PM - 4:00 PM', price: 800 },
    { id: '16:00-17:00', time: '4:00 PM - 5:00 PM', price: 800 },
    { id: '17:00-18:00', time: '5:00 PM - 6:00 PM', price: 900 },
    { id: '18:00-19:00', time: '6:00 PM - 7:00 PM', price: 900 },
    { id: '19:00-20:00', time: '7:00 PM - 8:00 PM', price: 1000 },
    { id: '20:00-21:00', time: '8:00 PM - 9:00 PM', price: 1000 },
    { id: '21:00-22:00', time: '9:00 PM - 10:00 PM', price: 1000 },
    { id: '22:00-23:00', time: '10:00 PM - 11:00 PM', price: 800 },
  ];

  const sports = [
    { id: 'badminton', name: 'Badminton', icon: '🏸' },
    { id: 'table-tennis', name: 'Table Tennis', icon: '🏓' },
    { id: 'box-cricket', name: 'Box Cricket', icon: '🏏' },
  ];

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Calculate total price
  const selectedSlot = timeSlots.find(slot => slot.id === selectedTimeSlot);
  const basePrice = selectedSlot ? selectedSlot.price : 0;
  const extraMemberPrice = memberCount > 2 ? (memberCount - 2) * 50 : 0;
  const totalPrice = basePrice + extraMemberPrice;

  const handleInputChange = (e) => {
    setBookingDetails({
      ...bookingDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTimeSlot || !selectedSport || !bookingDetails.customerName || !bookingDetails.customerEmail || !bookingDetails.customerPhone) {
      alert('Please fill all required fields');
      return;
    }

    const booking = {
      venue: venue,
      date: selectedDate,
      timeSlot: selectedSlot,
      memberCount,
      sport: sports.find(s => s.id === selectedSport),
      customerDetails: bookingDetails,
      totalPrice,
      bookingId: 'BK' + Date.now(),
    };

    onBookingConfirm(booking);
  };

  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        <div className="booking-modal-header">
          <h2>Book {venue?.name || 'Venue'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="booking-modal-content">
          {/* Customer Details */}
          <section className="booking-section">
            <h3>Customer Details</h3>
            <div className="form-group">
              <input
                type="text"
                name="customerName"
                placeholder="Full Name *"
                value={bookingDetails.customerName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="customerEmail"
                placeholder="Email Address *"
                value={bookingDetails.customerEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="customerPhone"
                placeholder="Phone Number *"
                value={bookingDetails.customerPhone}
                onChange={handleInputChange}
                required
              />
            </div>
          </section>

          {/* Date Selection */}
          <section className="booking-section">
            <h3>Select Date</h3>
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
          </section>

          {/* Sport Selection */}
          <section className="booking-section">
            <h3>Select Sport</h3>
            <div className="sports-grid">
              {sports.map(sport => (
                <div
                  key={sport.id}
                  className={`sport-option ${selectedSport === sport.id ? 'selected' : ''}`}
                  onClick={() => setSelectedSport(sport.id)}
                >
                  <span className="sport-icon">{sport.icon}</span>
                  <span className="sport-name">{sport.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Time Slot Selection */}
          <section className="booking-section">
            <h3>Select Time Slot</h3>
            <div className="time-slots-grid">
              {timeSlots.map(slot => (
                <div
                  key={slot.id}
                  className={`time-slot ${selectedTimeSlot === slot.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTimeSlot(slot.id)}
                >
                  <div className="slot-time">{slot.time}</div>
                  <div className="slot-price">₹{slot.price}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Member Count */}
          <section className="booking-section">
            <h3>Number of Members</h3>
            <div className="member-selector">
              <button
                type="button"
                onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
                className="member-btn"
              >
                -
              </button>
              <span className="member-count">{memberCount}</span>
              <button
                type="button"
                onClick={() => setMemberCount(memberCount + 1)}
                className="member-btn"
              >
                +
              </button>
            </div>
            {memberCount > 2 && (
              <p className="extra-member-note">
                Extra charge: ₹50 per person for more than 2 players
              </p>
            )}
          </section>

          {/* Booking Summary */}
          {selectedTimeSlot && (
            <section className="booking-section booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-item">
                <span>Base Price:</span>
                <span>₹{basePrice}</span>
              </div>
              {extraMemberPrice > 0 && (
                <div className="summary-item">
                  <span>Extra Members ({memberCount - 2}):</span>
                  <span>₹{extraMemberPrice}</span>
                </div>
              )}
              <div className="summary-item total">
                <span>Total Amount:</span>
                <span>₹{totalPrice}</span>
              </div>
            </section>
          )}
        </div>

        <div className="booking-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="book-now-btn"
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTimeSlot || !selectedSport}
          >
            Proceed to Payment (₹{totalPrice})
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
