import React, { useState } from "react";
import Header from "../components/Header";
import BookingModal from "../components/BookingModal";
import RazorpayPayment from "../components/RazorpayPayment";
import BookingConfirmation from "../components/BookingConfirmation";
import "./VenueDetails.css";

const VenueDetails = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // Venue data - you can replace this with actual data from props or API
  const venueData = {
    id: 1,
    name: "SBR Badminton",
    location: "Satellite, Jodhpur Village",
    rating: 4.5,
    reviews: 6,
    operatingHours: "7:00AM - 11:00PM",
    address:
      "2nd Floor, Anupam Banquet Hall, Opp. Akurai Heights, Satellite, Jodhpur Village, Ahmedabad, Gujarat - 380015",
  };

  const handleBookVenue = () => {
    setIsBookingModalOpen(true);
  };

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
    console.error("Payment failed:", error);
    alert("Payment failed: " + error);
    setShowPayment(false);
    // Optionally reopen booking modal
    setIsBookingModalOpen(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setBookingData(null);
    setPaymentData(null);
  };

  return (
    <>
      <Header showNavigation />

      <div className="venue-detail-container">
        {/* Header */}
        <div className="venue-detail-header">
          <h1>SBR Badminton</h1>
          <p className="venue-location">
            📍 Satellite, Jodhpur Village
            <span className="rating">⭐ 4.5 (6)</span>
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
            <button className="book-btn" onClick={handleBookVenue}>
              Book This Venue
            </button>

            <div className="info-card">
              <h4>🕒 Operating Hours</h4>
              <p>7:00AM - 11:00PM</p>
            </div>

            <div className="info-card">
              <h4>📍 Address</h4>
              <p>
                2nd Floor, Anupam Banquet Hall
                <br />
                Opp. Akurai Heights, Satellite,
                <br />
                Jodhpur Village, Ahmedabad, Gujarat - 380015
              </p>
            </div>

            <div className="info-card">
              <h4>📌 Location Map</h4>
              <div className="map-placeholder">Map</div>
            </div>
          </div>
        </div>

        {/* Sports Available */}
        <section className="sports-available">
          <h3>Sports Available</h3>
          <div className="sports-list">
            <div className="sport-card">🏸 Badminton</div>
            <div className="sport-card">🏓 Table Tennis</div>
            <div className="sport-card">🏏 Box Cricket</div>
          </div>
        </section>

        {/* Amenities */}
        <section className="amenities">
          <h3>Amenities</h3>
          <div className="amenities-list">
            <span>✔ Parking</span>
            <span>✔ Restroom</span>
            <span>✔ Refreshments</span>
            <span>✔ CCTV Surveillance</span>
            <span>✔ Centrally Air Conditioned Hall</span>
            <span>✔ Seating Arrangement</span>
            <span>✔ WiFi</span>
            <span>✔ Library</span>
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

        <section className="reviews">
          <h3>Player Reviews & Ratings</h3>
          <div className="review-card">
            <div className="review-user">Mitchell Admin - ⭐⭐⭐⭐⭐</div>
            <p>Nice turf, well maintained</p>
            <span className="review-date">📅 10 June 2025, 5:38 PM</span>
          </div>
          <div className="review-card">
            <div className="review-user">Mitchell Admin - ⭐⭐⭐⭐⭐</div>
            <p>Nice turf, well maintained</p>
            <span className="review-date">📅 10 June 2025, 5:38 PM</span>
          </div>
        </section>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        venue={venueData}
        onBookingConfirm={handleBookingConfirm}
      />

      {/* Payment Component */}
      {showPayment && bookingData && (
        <div className="payment-overlay">
          <RazorpayPayment
            bookingDetails={bookingData}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFailure={handlePaymentFailure}
          />
        </div>
      )}

      {/* Booking Confirmation */}
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
