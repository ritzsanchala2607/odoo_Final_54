import React from 'react';
import './ForgotPasswordModal.css';
import './BookingModals.css';
import Button from './Button';

const BookingDetailsModal = ({ booking, onClose }) => {
    if (!booking) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content booking-modal">
                <div className="modal-header">
                    <h2>Booking Details</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="fields-grid details-grid">
                        <div className="form-group">
                            <strong>Booking Reference</strong>
                            <span>{booking.booking_ref}</span>
                        </div>
                        <div className="form-group">
                            <strong>Status</strong>
                            <span>{booking.status}</span>
                        </div>
                        <div className="form-group">
                            <strong>Start Time</strong>
                            <span>{new Date(booking.start_at).toLocaleString()}</span>
                        </div>
                        <div className="form-group">
                            <strong>End Time</strong>
                            <span>{new Date(booking.end_at).toLocaleString()}</span>
                        </div>
                        <div className="form-group">
                            <strong>Sport Type</strong>
                            <span>{booking.sport_type || '-'}</span>
                        </div>
                        <div className="form-group">
                            <strong>Court Type</strong>
                            <span>{booking.court_type || '-'}</span>
                        </div>
                        <div className="form-group">
                            <strong>Location</strong>
                            <span>{booking.location || '-'}</span>
                        </div>
                        <div className="form-group">
                            <strong>People</strong>
                            <span>{booking.people || '-'}</span>
                        </div>
                        <div className="form-group">
                            <strong>Price per hour</strong>
                            <span>{booking.price_per_hour || '-'}</span>
                        </div>
                        <div className="form-group">
                            <strong>Total Amount</strong>
                            <span>{booking.total_amount}</span>
                        </div>
                        {booking.cancelled_at && (
                            <div className="form-group">
                                <strong>Cancelled At</strong>
                                <span>{new Date(booking.cancelled_at).toLocaleString()}</span>
                            </div>
                        )}
                        {booking.cancel_reason && (
                            <div className="form-group">
                                <strong>Cancel Reason</strong>
                                <span>{booking.cancel_reason}</span>
                            </div>
                        )}
                    </div>
                    <Button variant="primary" fullWidth onClick={onClose} style={{ marginTop: 24 }}>Close</Button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;
