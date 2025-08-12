import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import BookingModal from "../components/BookingModal";
import SimpleMap from "../components/SimpleMap";
import CourtBookingModal from "../components/CourtBookingModal";
import "./VenueDetails.css";

const VenueDetails = () => {
  const { id } = useParams();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/venues/${id}`);
        setVenue(res.data.venue);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Failed to load venue");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVenue();
  }, [id]);

  const handleBookVenue = () => {
    setIsBookingModalOpen(true);
  };

  const handleBookCourt = (court) => {
    setSelectedCourt(court);
    setIsCourtModalOpen(true);
  };

  const handleBookingConfirm = ({ booking }) => {
    setBookingData(booking);
    setIsCourtModalOpen(false);
    alert('Booking confirmed with credits. See My Bookings for details.');
  };

  const venueName = venue?.name || "Venue";
  const venueAddress = venue?.address || venue?.city || "";
  const latitude = venue?.latitude;
  const longitude = venue?.longitude;
  const ratingAvg = Number(venue?.rating_avg || 0);
  const courts = venue?.courts || [];
  const activeCourts = courts.filter(c => c.is_active);
  const sportTypes = Array.from(new Set(activeCourts.map(c => c.sport_type)));

  return (
    <>
      <Header showNavigation />

      <div className="venue-detail-container">
        {loading ? (
          <p>Loading venue...</p>
        ) : error ? (
          <p style={{ color: 'crimson' }}>{error}</p>
        ) : !venue ? (
          <p>Venue not found</p>
        ) : (
          <>
            {/* Header */}
            <div className="venue-detail-header">
              <h1>{venueName}</h1>
              <p className="venue-location">
                📍 {venueAddress}
                <span className="rating">⭐ {ratingAvg.toFixed(1)} ({courts.length})</span>
              </p>
            </div>

            <div className="venue-main">
              {/* Left: Images/Videos */}
              <div className="venue-gallery">
                <button className="gallery-btn prev">‹</button>
                <div className="gallery-content">Images / Videos</div>
                <button className="gallery-btn next">›</button>
              </div>

              {/* Right: Booking + Info */}
              <div className="venue-sidebar">
                <div className="info-card">
                  <h4>🕒 Operating Hours</h4>
                  <p>7:00AM - 11:00PM</p>
                </div>

                <div className="info-card">
                  <h4>📍 Address</h4>
                  <p>{venueAddress}</p>
                </div>

                <div className="info-card">
                  <h4>📌 Location Map</h4>
                  {latitude && longitude ? (
                    <>
                      <SimpleMap
                        latitude={latitude}
                        longitude={longitude}
                        venueName={venueName}
                        address={venueAddress}
                      />
                      <div className="coordinates-display">
                        <div style={{ marginBottom: '8px' }}>
                          📍 Coordinates: {latitude}, {longitude}
                        </div>
                        <a
                          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#4B0082',
                            textDecoration: 'none',
                            fontWeight: '500',
                            fontSize: '11px'
                          }}
                        >
                          🗺️ Open in Google Maps
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="map-placeholder">Location not set</div>
                  )}
                </div>
              </div>
            </div>

            {/* Sports Available */}
            <section className="sports-available">
              <h3>Sports Available</h3>
              <div className="sports-list">
                {sportTypes.length > 0 ? (
                  sportTypes.map((s) => (
                    <div key={s} className="sport-card">{s}</div>
                  ))
                ) : (
                  <div className="sport-card">No active courts</div>
                )}
              </div>
            </section>

            {/* Courts list with booking */}
            <section className="amenities">
              <h3>Courts at this venue</h3>
              <div className="amenities-list" style={{ gap: '14px' }}>
                {activeCourts.map((c) => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{c.name} • {c.sport_type} • ₹{c.price_per_hour}/hr</span>
                    <button
                      type="button"
                      className="book-btn"
                      style={{ padding: '6px 10px' }}
                      onClick={() => handleBookCourt(c)}
                    >
                      Book
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* About */}
            <section className="about-venue">
              <h3>About Venue</h3>
              <ul>
                <li>Tournament Training Venue</li>
                <li>For more than 2 players Rs. 50 extra per person</li>
                <li>Equipment available on rent</li>
              </ul>
            </section>
          </>
        )}
      </div>

      {/* Court booking modal */}
      <CourtBookingModal
        isOpen={isCourtModalOpen}
        onClose={() => setIsCourtModalOpen(false)}
        court={selectedCourt}
        venue={venue}
        onBookingConfirm={handleBookingConfirm}
      />
    </>
  );
};

export default VenueDetails;
