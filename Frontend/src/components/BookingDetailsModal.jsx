import React from 'react';
import Button from './Button';
import './BookingModals.css';

const BookingDetailsModal = ({ open, onClose, booking }) => {
    if (!open || !booking) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Booking Details • {booking.bookingId}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <div className="details-grid">
                        <div>
                            <div className="detail-label">Sport</div>
                            <div className="detail-value">{booking.sportIcon} {booking.sportName}</div>
                        </div>
                        <div>
                            <div className="detail-label">Status</div>
                            <div className="detail-value" style={{ color: '#6B5B95', fontWeight: 700 }}>{booking.status}</div>
                        </div>
                        <div>
                            <div className="detail-label">Venue</div>
                            <div className="detail-value">{booking.venueName}</div>
                        </div>
                        <div>
                            <div className="detail-label">Location</div>
                            <div className="detail-value">{booking.venueLocation}</div>
                        </div>
                        <div>
                            <div className="detail-label">Date</div>
                            <div className="detail-value">{new Date(booking.date).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <div className="detail-label">Time</div>
                            <div className="detail-value">{booking.time}</div>
                        </div>
                        <div>
                            <div className="detail-label">Court Type</div>
                            <div className="detail-value">{booking.courtType || '—'}</div>
                        </div>
                        <div>
                            <div className="detail-label">People</div>
                            <div className="detail-value">{booking.people || '—'}</div>
                        </div>
                        <div>
                            <div className="detail-label">Price</div>
                            <div className="detail-value">{booking.totalAmount || booking.total_amount || '—'}</div>
                        </div>
                        {booking.cancellationReason && (
                            <div style={{ gridColumn: '1 / -1' }}>
                                <div className="detail-label">Cancellation Reason</div>
                                <div className="detail-value">{booking.cancellationReason}</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;
