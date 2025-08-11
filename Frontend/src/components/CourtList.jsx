import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './CourtList.css';

const CourtList = ({ venueId, onCourtSelect }) => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (venueId) {
      fetchCourts();
    }
  }, [venueId]);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching courts for venue ID:', venueId);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/courts?venue_id=${venueId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Courts API response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Courts data received:', result);
        setCourts(result.courts || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Courts API error:', errorData);
        setError(`Failed to fetch courts: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching courts:', error);
      setError(`Error loading courts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="courts-container">
        <h3>Available Courts</h3>
        <div className="courts-loading">
          <div className="loading-spinner"></div>
          <p>Loading courts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courts-container">
        <h3>Available Courts</h3>
        <div className="courts-error">
          <p>{error}</p>
          <button onClick={fetchCourts} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (courts.length === 0) {
    return (
      <div className="courts-container">
        <h3>Available Courts</h3>
        <div className="no-courts">
          <p>No courts available at this venue.</p>
          <p className="no-courts-note">This venue doesn't have any courts set up yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="courts-container">
      <h3>Available Courts ({courts.length})</h3>
      <div className="courts-grid">
        {courts.map((court) => (
          <div key={court.id} className="court-card" onClick={() => onCourtSelect(court)}>
            <div className="court-header">
              <h4>{court.name}</h4>
              <span className="sport-type">{court.sport_type}</span>
            </div>
            <div className="court-details">
              <div className="pricing">
                <div className="price-item">
                  <span className="price-label">Per Hour:</span>
                  <span className="price-value">₹{court.price_per_hour}</span>
                </div>
                {court.price_per_person && (
                  <div className="price-item">
                    <span className="price-label">Per Person:</span>
                    <span className="price-value">₹{court.price_per_person}</span>
                  </div>
                )}
              </div>
              <div className="court-info">
                <span className="capacity">Capacity: {court.capacity} people</span>
                <span className={`status ${court.is_active ? 'active' : 'inactive'}`}>
                  {court.is_active ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourtList;
