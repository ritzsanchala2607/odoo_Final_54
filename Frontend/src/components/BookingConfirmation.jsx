import React from 'react';
import './BookingConfirmation.css';

const BookingConfirmation = ({ bookingData, onClose }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadBookingDetails = () => {
    const bookingText = `
BOOKING CONFIRMATION
====================

Booking ID: ${bookingData.bookingDetails.bookingId}
Payment ID: ${bookingData.razorpay_payment_id}

VENUE DETAILS
-------------
Venue: ${bookingData.bookingDetails.venue?.name || 'N/A'}
Sport: ${bookingData.bookingDetails.sport?.name || 'N/A'}
Date: ${formatDate(bookingData.bookingDetails.date)}
Time: ${bookingData.bookingDetails.timeSlot?.time || 'N/A'}
Members: ${bookingData.bookingDetails.memberCount}

CUSTOMER DETAILS
----------------
Name: ${bookingData.bookingDetails.customerDetails.customerName}
Email: ${bookingData.bookingDetails.customerDetails.customerEmail}
Phone: ${bookingData.bookingDetails.customerDetails.customerPhone}

PAYMENT DETAILS
---------------
Amount Paid: ₹${bookingData.bookingDetails.totalPrice}
Payment Status: Confirmed
Payment Method: Razorpay

Thank you for booking with us!
    `;

    const element = document.createElement('a');
    const file = new Blob([bookingText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `booking-${bookingData.bookingDetails.bookingId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="booking-confirmation-overlay">
      <div className="booking-confirmation">
        <div className="confirmation-header">
          <div className="success-icon">✅</div>
          <h2>Booking Confirmed!</h2>
          <p>Your venue has been successfully booked</p>
        </div>

        <div className="confirmation-content">
          <div className="booking-id">
            <strong>Booking ID: {bookingData.bookingDetails.bookingId}</strong>
          </div>

          <div className="booking-details-grid">
            <div className="detail-card">
              <h4>📍 Venue Details</h4>
              <p><strong>{bookingData.bookingDetails.venue?.name || 'N/A'}</strong></p>
              <p>{bookingData.bookingDetails.sport?.icon} {bookingData.bookingDetails.sport?.name}</p>
            </div>

            <div className="detail-card">
              <h4>📅 Date & Time</h4>
              <p><strong>{formatDate(bookingData.bookingDetails.date)}</strong></p>
              <p>{bookingData.bookingDetails.timeSlot?.time}</p>
            </div>

            <div className="detail-card">
              <h4>👥 Members</h4>
              <p><strong>{bookingData.bookingDetails.memberCount} People</strong></p>
            </div>

            <div className="detail-card">
              <h4>💰 Payment</h4>
              <p><strong>₹{bookingData.bookingDetails.totalPrice}</strong></p>
              <p className="payment-status">✅ Paid</p>
            </div>
          </div>

          <div className="customer-details">
            <h4>Customer Information</h4>
            <div className="customer-info">
              <p><strong>Name:</strong> {bookingData.bookingDetails.customerDetails.customerName}</p>
              <p><strong>Email:</strong> {bookingData.bookingDetails.customerDetails.customerEmail}</p>
              <p><strong>Phone:</strong> {bookingData.bookingDetails.customerDetails.customerPhone}</p>
            </div>
          </div>

          <div className="important-notes">
            <h4>⚠️ Important Notes</h4>
            <ul>
              <li>Please arrive 10 minutes before your scheduled time</li>
              <li>Carry a valid ID proof for verification</li>
              <li>Cancellation allowed up to 2 hours before booking time</li>
              <li>Equipment rental available at venue (if applicable)</li>
            </ul>
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="download-btn" onClick={downloadBookingDetails}>
            📄 Download Details
          </button>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
