import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import './CourtBookingModal.css';

// Load Razorpay script helper (not used for booking)
const loadRazorpayScript = () => new Promise((resolve) => resolve(true));

const CourtBookingModal = ({ isOpen, onClose, court, venue, onBookingConfirm }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [pricingMode, setPricingMode] = useState('per_hour');
  const [memberCount, setMemberCount] = useState(1);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [topupLoading, setTopupLoading] = useState(false);
  const [error, setError] = useState('');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen && user) {
      fetchUserBalance();
    }
  }, [isOpen, user]);

  useEffect(() => {
    // Default pricing mode based on court settings
    if (court) {
      if (court.allow_per_hour) setPricingMode('per_hour');
      else if (court.allow_per_person) setPricingMode('per_person');
    }
  }, [court]);

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

  const timeOptions = useMemo(() => {
    const opts = [];
    for (let hour = 7; hour <= 22; hour++) {
      const hh = hour.toString().padStart(2, '0');
      opts.push(`${hh}:00`);
    }
    return opts;
  }, []);

  const filteredEndOptions = useMemo(() => {
    if (!startTime) return [];
    const startHour = parseInt(startTime.split(':')[0], 10);
    const opts = [];
    for (let hour = startHour + 1; hour <= 23; hour++) {
      const hh = hour.toString().padStart(2, '0');
      opts.push(`${hh}:00`);
    }
    return opts;
  }, [startTime]);

  const durationHours = useMemo(() => {
    if (!startTime || !endTime) return 0;
    const startH = parseInt(startTime.split(':')[0], 10);
    const endH = parseInt(endTime.split(':')[0], 10);
    const diff = endH - startH;
    return diff > 0 ? diff : 0;
  }, [startTime, endTime]);

  // Calculate pricing based on mode and duration
  const calculatePricing = () => {
    if (!court || durationHours === 0) return { unitPrice: 0, totalAmount: 0 };

    let unitPrice = 0;
    if (pricingMode === 'per_person') {
      unitPrice = court.price_per_person || 0;
    } else {
      unitPrice = court.price_per_hour || 0;
    }

    const totalAmount = pricingMode === 'per_person'
      ? (unitPrice * memberCount * durationHours)
      : (unitPrice * durationHours);

    return { unitPrice, totalAmount };
  };

  const { unitPrice, totalAmount } = calculatePricing();
  const creditsNeeded = Math.ceil(totalAmount);
  const hasEnoughCredits = userBalance >= creditsNeeded;
  const creditShortfall = hasEnoughCredits ? 0 : creditsNeeded - userBalance;

  const handleBuyCredits = async () => {
    // Keep integrated Razorpay top-up if needed; not used for booking submission
    try {
      setError('');
      if (creditShortfall <= 0) return;
      setTopupLoading(true);
      // Open buy credits page for now to keep flow simple
      window.location.href = '/buy-credits';
    } catch (e) {
      setError(e.message);
    } finally {
      setTopupLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !startTime || !endTime) {
      setError('Please select date, start and end time');
      return;
    }

    if (durationHours <= 0) {
      setError('End time must be after start time');
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
          start_at: `${selectedDate}T${startTime}:00`,
          end_at: `${selectedDate}T${endTime}:00`,
          pricing_mode: pricingMode,
          unit_price: unitPrice,
          total_amount: totalAmount,
          player_capacity: memberCount,
          visibility: 'private'
        })
      });

      const result = await response.json();
      if (response.ok) {
        onBookingConfirm({
          booking: result.booking,
          court,
          venue,
        });
      } else {
        // Surface overlap or credit errors
        setError(result.message || 'Booking failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

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
                {court?.allow_per_hour && (
                  <span>Per Hour: ₹{court?.price_per_hour}</span>
                )}
                {court?.allow_per_person && court?.price_per_person && (
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
                  <button className="buy-credits-btn" onClick={handleBuyCredits} disabled={topupLoading}>
                    {topupLoading ? 'Processing...' : `Buy Credits (₹${creditShortfall})`}
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
              {court?.allow_per_hour && (
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
              )}
              {court?.allow_per_person && court?.price_per_person && (
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

          {/* Time Selection */}
          <section className="booking-section">
            <h3>Select Time</h3>
            <div className="time-selectors">
              <div>
                <label>Start</label>
                <select value={startTime} onChange={(e) => { setStartTime(e.target.value); setEndTime(''); }}>
                  <option value="">--</option>
                  {timeOptions.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>End</label>
                <select value={endTime} onChange={(e) => setEndTime(e.target.value)} disabled={!startTime}>
                  <option value="">--</option>
                  {filteredEndOptions.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div style={{ alignSelf: 'flex-end', fontSize: 12, color: '#555' }}>
                {durationHours > 0 ? `${durationHours} hour(s)` : 'Select start and end'}
              </div>
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
          {startTime && endTime && (
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
                <span>{startTime} - {endTime} ({durationHours}h)</span>
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
            disabled={!selectedDate || !startTime || !endTime || durationHours <= 0 || !hasEnoughCredits || loading}
          >
            {loading ? 'Processing...' : `Book with Credits (₹${creditsNeeded})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourtBookingModal;



