import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import BookingModal from "../components/BookingModal";
import RazorpayPayment from "../components/RazorpayPayment";
import BookingConfirmation from "../components/BookingConfirmation";
import "./VenueDetails.css";

const VenueDetails = () => {
  const { id } = useParams(); // Get venue ID from route
  const [venueData, setVenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    async function fetchVenue() {
      setLoading(true);
      try {
        const res = await fetch(`/api/venues/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setVenueData(data.venue || data); // Adjust based on your API response
      } catch (err) {
        setVenueData(null);
      }
      setLoading(false);
    }
    fetchVenue();
  }, [id]);

  const handleBookVenue = () => setIsBookingModalOpen(true);
  const handleBookingConfirm = (booking) => {
    setBookingData(booking);
    setIsBookingModalOpen(false);
    setShowPayment(true);
  };
  const handlePaymentSuccess = (paymentResult) => {
    setPaymentData(paymentResult);
    setShowPayment(false);
    setShowConfirmation(true);
  };
  const handlePaymentFailure = (error) => {
    alert("Payment failed: " + error);
    setShowPayment(false);
    setIsBookingModalOpen(true);
  };
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setBookingData(null);
    setPaymentData(null);
  };

  if (loading) return <div>Loading venue details...</div>;
  if (!venueData) return <div>Venue not found.</div>;

  return (
    <>
      <Header showNavigation />
      <div className="venue-detail-container">
        <div className="venue-detail-header">
          <h1>{venueData.name}</h1>
          <p className="venue-location">
            📍 {venueData.location || venueData.city}
            <span className="rating">
              ⭐ {venueData.rating || 4.5} ({venueData.reviews || 0})
            </span>
          </p>
        </div>
        <div className="venue-main">
          <div className="venue-gallery">
            <button className="gallery-btn prev">‹</button>
            <div className="gallery-content">Images / Videos</div>
            <button className="gallery-btn next">›</button>
          </div>
          <div className="venue-sidebar">
            <button className="book-btn" onClick={handleBookVenue}>
              Book This Venue
            </button>
            <div className="info-card">
              <h4>🕒 Operating Hours</h4>
              <p>{venueData.operatingHours || "7:00AM - 11:00PM"}</p>
            </div>
            <div className="info-card">
              <h4>📍 Address</h4>
              <p>{venueData.address}</p>
            </div>
            <div className="info-card">
              <h4>📌 Location Map</h4>
              <div className="map-placeholder">Map</div>
            </div>
          </div>
        </div>
        <section className="sports-available">
          <h3>Sports Available</h3>
          <div className="sports-list">
            {(
              venueData.sports || [
                "🏸 Badminton",
                "🏓 Table Tennis",
                "🏏 Box Cricket",
              ]
            ).map((sport, i) => (
              <div className="sport-card" key={i}>
                {sport}
              </div>
            ))}
          </div>
        </section>
        <section className="amenities">
          <h3>Amenities</h3>
          <div className="amenities-list">
            {(
              venueData.amenities || [
                "✔ Parking",
                "✔ Restroom",
                "✔ Refreshments",
                "✔ CCTV Surveillance",
                "✔ Centrally Air Conditioned Hall",
                "✔ Seating Arrangement",
                "✔ WiFi",
                "✔ Library",
              ]
            ).map((amenity, i) => (
              <span key={i}>{amenity}</span>
            ))}
          </div>
        </section>
        <section className="about-venue">
          <h3>About Venue</h3>
          <ul>
            {(
              venueData.about || [
                "Tournament Training Venue",
                "For more than 2 players Rs. 50 extra per person",
                "Equipment available on rent",
              ]
            ).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="reviews">
          <h3>Player Reviews & Ratings</h3>
          {(
            venueData.reviewsList || [
              {
                user: "Mitchell Admin",
                rating: 5,
                comment: "Nice turf, well maintained",
                date: "📅 10 June 2025, 5:38 PM",
              },
              {
                user: "Mitchell Admin",
                rating: 5,
                comment: "Nice turf, well maintained",
                date: "📅 10 June 2025, 5:38 PM",
              },
            ]
          ).map((review, i) => (
            <div className="review-card" key={i}>
              <div className="review-user">
                {review.user} - {"⭐".repeat(review.rating)}
              </div>
              <p>{review.comment}</p>
              <span className="review-date">{review.date}</span>
            </div>
          ))}
        </section>
      </div>
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        venue={venueData}
        onBookingConfirm={handleBookingConfirm}
      />
      {showPayment && bookingData && (
        <div className="payment-overlay">
          <RazorpayPayment
            bookingDetails={bookingData}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFailure={handlePaymentFailure}
          />
        </div>
      )}
      {showConfirmation && paymentData && (
        <BookingConfirmation
          bookingData={paymentData}
          onClose={handleCloseConfirmation}
        />
      )}
    </>
  );
};

export default VenueDetails;
