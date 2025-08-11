import React, { useEffect, useState } from 'react';
import Button from './Button';
import './BookingModals.css';

// Editable fields inspired by Backend/model/booking.js
// booking_ref, start_at, end_at, status, total_amount, cancel_reason
const BookingEditModal = ({ open, onClose, initial, onSave }) => {
    const [form, setForm] = useState({});

    useEffect(() => {
        if (open) {
            setForm({
                booking_ref: initial?.bookingId || initial?.booking_ref || '',
                sportName: initial?.sportName || '',
                sportIcon: initial?.sportIcon || '',
                venueName: initial?.venueName || '',
                venueLocation: initial?.venueLocation || '',
                start_at: initial?.start_at || initial?.date || '',
                end_at: initial?.end_at || '',
                status: initial?.status || 'confirmed',
                total_amount: initial?.totalAmount || initial?.total_amount || '',
                courtType: initial?.courtType || '',
                people: initial?.people || '',
                cancel_reason: initial?.cancellationReason || ''
            });
        }
    }, [open, initial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave?.(form);
    };

    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Edit Booking • {form.booking_ref}</h3>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Sport</label>
                                <input name="sportName" value={form.sportName} onChange={handleChange} placeholder="Football" />
                            </div>
                            <div className="form-group">
                                <label>Venue</label>
                                <input name="venueName" value={form.venueName} onChange={handleChange} placeholder="City Sports Arena" />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input name="venueLocation" value={form.venueLocation} onChange={handleChange} placeholder="Downtown" />
                            </div>
                            <div className="form-group">
                                <label>Start</label>
                                <input type="datetime-local" name="start_at" value={form.start_at} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>End</label>
                                <input type="datetime-local" name="end_at" value={form.end_at} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select name="status" value={form.status} onChange={handleChange}>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Total Amount</label>
                                <input name="total_amount" value={form.total_amount} onChange={handleChange} placeholder="$40" />
                            </div>
                            <div className="form-group">
                                <label>Court Type</label>
                                <input name="courtType" value={form.courtType} onChange={handleChange} placeholder="Turf / Hard / Indoor" />
                            </div>
                            <div className="form-group">
                                <label>People</label>
                                <input name="people" value={form.people} onChange={handleChange} placeholder="4" />
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label>Cancel Reason</label>
                                <input name="cancel_reason" value={form.cancel_reason} onChange={handleChange} placeholder="Optional" />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" type="button" onClick={onClose}>Close</Button>
                        <Button variant="primary" type="submit">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingEditModal;
