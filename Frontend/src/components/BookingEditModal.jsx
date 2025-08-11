import React, { useState } from 'react';
import './ForgotPasswordModal.css';
import './BookingModals.css';
import Button from './Button';

const initialFields = (booking) => ({
    booking_ref: booking?.booking_ref || '',
    user_id: booking?.user_id || '',
    court_id: booking?.court_id || '',
    venue_id: booking?.venue_id || '',
    start_at: booking?.start_at ? new Date(booking.start_at).toISOString().slice(0, 16) : '',
    end_at: booking?.end_at ? new Date(booking.end_at).toISOString().slice(0, 16) : '',
    status: booking?.status || 'confirmed',
    total_amount: booking?.total_amount || '',
    // From Court model context
    sport_type: booking?.sport_type || '',
    price_per_hour: booking?.price_per_hour || '',
    capacity: booking?.capacity || '',
    // Frontend-only selection for now
    payment_option: booking?.payment_option || 'pay_on_visit',
    cancel_reason: booking?.cancel_reason || '',
});

const BookingEditModal = ({ booking, onSave, onClose, mode = 'edit' }) => {
    const [fields, setFields] = useState(initialFields(booking));
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!fields.booking_ref || !fields.user_id || !fields.court_id || !fields.venue_id || !fields.start_at || !fields.end_at || !fields.total_amount) {
            setError('Please fill all required fields.');
            return;
        }
        setError('');
        onSave(fields);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content booking-modal">
                <div className="modal-header">
                    <h2>{mode === 'edit' ? 'Edit Booking' : 'Create Booking'}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <form className="modal-body booking-form" onSubmit={handleSubmit}>
                    <div className="fields-grid">
                        <div className="form-group">
                            <label>Booking Reference*</label>
                            <input name="booking_ref" value={fields.booking_ref} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>User ID*</label>
                            <input name="user_id" value={fields.user_id} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Court ID*</label>
                            <input name="court_id" value={fields.court_id} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Venue ID*</label>
                            <input name="venue_id" value={fields.venue_id} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Sport Type</label>
                            <input name="sport_type" value={fields.sport_type} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Capacity</label>
                            <input name="capacity" type="number" min="1" value={fields.capacity} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Start Time*</label>
                            <input type="datetime-local" name="start_at" value={fields.start_at} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>End Time*</label>
                            <input type="datetime-local" name="end_at" value={fields.end_at} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select name="status" value={fields.status} onChange={handleChange}>
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Price per hour</label>
                            <input name="price_per_hour" type="number" step="0.01" value={fields.price_per_hour} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Total Amount*</label>
                            <input name="total_amount" type="number" step="0.01" value={fields.total_amount} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Payment Option</label>
                            <select name="payment_option" value={fields.payment_option} onChange={handleChange}>
                                <option value="pay_on_visit">Pay on visit</option>
                            </select>
                        </div>
                        {mode === 'edit' && (
                            <div className="form-group">
                                <label>Cancel Reason</label>
                                <input name="cancel_reason" value={fields.cancel_reason} onChange={handleChange} />
                            </div>
                        )}
                    </div>
                    {error && <span className="error-message">{error}</span>}
                    <Button variant="primary" fullWidth type="submit" style={{ marginTop: 24 }}>{mode === 'edit' ? 'Save Changes' : 'Create Booking'}</Button>
                </form>
            </div>
        </div>
    );
};

export default BookingEditModal;
