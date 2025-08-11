import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './CourtBookingModal.css';

const CourtBookingModal = ({ isOpen, onClose, court, venue, onBookingConfirm }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [pricingMode, setPricingMode] = useState('per_hour');
  const [memberCount, setMemberCount] = useState(1);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen && user) {
      fetchUserBalance();
    }
  }, [isOpen, user]);

  const fetchUserBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setUserBalance(result.user.credit_balance || 0);
      }
    } catch (error) {
      console.error('Error fetching user balance:', error);
    }
  };

  // Calculate pricing based on mode
  const calculatePricing = () => {
    if (!court) return { unitPrice: 0, totalAmount: 0 };

    let unitPrice = 0;
    if (pricingMode === 'per_person') {
      unitPrice = court.price_per_person || 0;
    } else {
      unitPrice = court.price_per_hour || 0;
    }

    const totalAmount = pricingMode === 'per_person' 
      ? unitPrice * memberCount 
      : unitPrice;

    return { unitPrice, totalAmount };
  };

  const { unitPrice, totalAmount } = calculatePricing();
  const creditsNeeded = Math.ceil(totalAmount);
  const hasEnoughCredits = userBalance >= creditsNeeded;
  const creditShortfall = hasEnoughCredits ? 0 : creditsNeeded - userBalance;

  const handleBooking = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      setError('Please select date and time slot');
      return;
    }

    if (!hasEnoughCredits) {
      setError('Insufficient credits. Please purchase more credits.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          court_id: court.id,
          venue_id: venue.id,
          start_at: `${selectedDate}T${selectedTimeSlot.split('-')[0]}:00`,
          end_at: `${selectedDate}T${selectedTimeSlot.split('-')[1]}:00`,
          pricing_mode: pricingMode,
          unit_price: unitPrice,
          total_amount: totalAmount,
          player_capacity: memberCount,
          visibility: 'private'
        })
      });

      if (response.ok) {
        const result = await response.json();
        onBookingConfirm({
          booking: result.booking,
          court,
          venue,
          totalAmount,
          creditsUsed: creditsNeeded
        });
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Booking failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots (7 AM to 11 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 22; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      slots.push({
        id: `${startTime}-${endTime}`,
        time: `${hour}:00 - ${hour + 1}:00`,
        hour: hour
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  if (!isOpen) return null;

  return (
    <div className="court-booking-modal-overlay">
      <div className="court-booking-modal">
        <div className="court-booking-modal-header">
          <h2>Book {court?.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="court-booking-modal-content">
          {/* Court Info */}
          <section className="booking-section">
            <div className="court-info-card">
              <h3>{court?.name}</h3>
              <p className="sport-type">{court?.sport_type}</p>
              <div className="court-pricing">
                <span>Per Hour: ₹{court?.price_per_hour}</span>
                {court?.price_per_person && (
                  <span>Per Person: ₹{court?.price_per_person}</span>
                )}
              </div>
            </div>
          </section>

          {/* User Balance */}
          <section className="booking-section">
            <div className="balance-card">
              <h3>Your Credit Balance</h3>
              <div className="balance-amount">₹{userBalance}</div>
              {!hasEnoughCredits && (
                <div className="insufficient-balance">
                  <p>Insufficient credits. You need ₹{creditShortfall} more.</p>
                  <button className="buy-credits-btn" onClick={() => window.location.href = '/shop'}>
                    Buy Credits
                  </button>
                </div>
              )}
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

          {/* Pricing Mode Selection */}
          <section className="booking-section">
            <h3>Pricing Mode</h3>
            <div className="pricing-mode-selector">
              <label className={`pricing-option ${pricingMode === 'per_hour' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="pricingMode"
                  value="per_hour"
                  checked={pricingMode === 'per_hour'}
                  onChange={(e) => setPricingMode(e.target.value)}
                />
                <span>Per Hour (₹{court?.price_per_hour})</span>
              </label>
              {court?.price_per_person && (
                <label className={`pricing-option ${pricingMode === 'per_person' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="pricingMode"
                    value="per_person"
                    checked={pricingMode === 'per_person'}
                    onChange={(e) => setPricingMode(e.target.value)}
                  />
                  <span>Per Person (₹{court?.price_per_person})</span>
                </label>
              )}
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
                </div>
              ))}
            </div>
          </section>

          {/* Member Count (only for per_person mode) */}
          {pricingMode === 'per_person' && (
            <section className="booking-section">
              <h3>Number of Players</h3>
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
            </section>
          )}

          {/* Booking Summary */}
          {selectedTimeSlot && (
            <section className="booking-section booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-item">
                <span>Court:</span>
                <span>{court?.name}</span>
              </div>
              <div className="summary-item">
                <span>Date:</span>
                <span>{selectedDate}</span>
              </div>
              <div className="summary-item">
                <span>Time:</span>
                <span>{selectedTimeSlot}</span>
              </div>
              <div className="summary-item">
                <span>Pricing:</span>
                <span>{pricingMode === 'per_hour' ? 'Per Hour' : `Per Person (${memberCount} players)`}</span>
              </div>
              <div className="summary-item">
                <span>Unit Price:</span>
                <span>₹{unitPrice}</span>
              </div>
              <div className="summary-item total">
                <span>Total Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="summary-item credits">
                <span>Credits Required:</span>
                <span className={hasEnoughCredits ? 'sufficient' : 'insufficient'}>
                  ₹{creditsNeeded} {!hasEnoughCredits && `(Need ₹${creditShortfall} more)`}
                </span>
              </div>
            </section>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>

        <div className="court-booking-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="book-now-btn"
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTimeSlot || !hasEnoughCredits || loading}
          >
            {loading ? 'Processing...' : `Book with Credits (₹${creditsNeeded})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourtBookingModal;



