import React, { useMemo, useState, useEffect } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import BookingDetailsModal from "../components/BookingDetailsModal";
import BookingEditModal from "../components/BookingEditModal";
import ReviewModal from "../components/ReviewModal";
import "../components/ForgotPasswordModal.css";
import "../components/BookingModals.css";
import "../components/ReviewModal.css";
import "./MyBookingsPage.css";

const MyBookingsPage = () => {
  const THEME = "#6B5B95";

  // Create Wizard modal visibility
  const [showWizard, setShowWizard] = useState(false);

  // Stepper state
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");

  // Bookings list state
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editMode, setEditMode] = useState("edit");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Review modal state
  const [showReview, setShowReview] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] =
    useState(null);

  // Animation state for filtering
  const [isFiltering, setIsFiltering] = useState(false);
  const [courtAnimationKey, setCourtAnimationKey] = useState(0);

  // Demo bookings data
  const bookings = {
    upcoming: [
      {
        id: 1,
        sportName: "Football",
        venueName: "City Sports Arena",
        venueLocation: "Downtown",
        venueImage:
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop&q=60",
        date: "2025-02-15",
        time: "06:30 PM - 08:00 PM",
        status: "confirmed",
        bookingId: "QC-FTB-0001",
        price_per_hour: "120.00",
        capacity: 10,
      },
      {
        id: 2,
        sportName: "Basketball",
        venueName: "Skyline Courts",
        venueLocation: "Uptown",
        venueImage:
          "https://images.unsplash.com/photo-1518600506278-4e8ef466b810?w=800&auto=format&fit=crop&q=60",
        date: "2025-02-20",
        time: "07:00 PM - 09:00 PM",
        status: "pending",
        bookingId: "QC-BSK-0137",
        price_per_hour: "90.00",
        capacity: 8,
      },
    ],
    past: [
      {
        id: 3,
        sportName: "Tennis",
        venueName: "Court Central",
        venueLocation: "Central Park",
        venueImage:
          "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=60",
        date: "2025-01-10",
        time: "05:00 PM - 06:00 PM",
        status: "completed",
        bookingId: "QC-TNS-0972",
        price_per_hour: "60.00",
        capacity: 4,
      },
    ],
    cancelled: [
      {
        id: 5,
        sportName: "Football",
        venueName: "Greenfield Grounds",
        venueLocation: "Greenfield Ave",
        venueImage:
          "https://images.unsplash.com/photo-1521417531039-96cce66f7d50?w=800&auto=format&fit=crop&q=60",
        date: "2025-01-25",
        time: "03:00 PM - 04:30 PM",
        status: "cancelled",
        bookingId: "QC-FTB-0190",
        cancellationReason: "Weather conditions",
      },
    ],
  };

  // Function to check if booking is completed (event has passed)
  const isBookingCompleted = (booking) => {
    try {
      const currentDate = new Date();
      const bookingDate = new Date(booking.date);

      // Extract end time from time string (e.g., "06:30 PM - 08:00 PM")
      const timeRange = booking.time.split(" - ");
      if (timeRange.length !== 2) return false;

      const endTimeStr = timeRange[1].trim();
      const [time, period] = endTimeStr.split(" ");
      const [hours, minutes] = time.split(":").map(Number);

      // Convert to 24-hour format
      let endHour = hours;
      if (period === "PM" && hours !== 12) {
        endHour += 12;
      } else if (period === "AM" && hours === 12) {
        endHour = 0;
      }

      // Set the end time on the booking date
      const bookingEndTime = new Date(bookingDate);
      bookingEndTime.setHours(endHour, minutes, 0, 0);

      // Check if current time is after booking end time
      return currentDate >= bookingEndTime;
    } catch (error) {
      console.error("Error parsing booking time:", error);
      return false;
    }
  };

  // Function to handle review submission
  const handleReviewSubmit = (reviewData) => {
    console.log("Review submitted:", {
      booking_id: selectedBookingForReview.id,
      venue_id: selectedBookingForReview.venueId || "venue-uuid",
      user_id: "current-user-uuid", // This should come from auth context
      rating: reviewData.rating,
      title: reviewData.title,
      body: reviewData.body,
      created_at: new Date().toISOString(),
    });

    // Here you would typically send the review to your API
    alert("Review submitted successfully!");
    setShowReview(false);
    setSelectedBookingForReview(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "cancelled":
        return "#EF4444";
      case "completed":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  // Courts data
  const courts = useMemo(
    () => [
      {
        id: "c1",
        name: "City Sports Arena",
        city: "Mumbai",
        sport: "Football",
        location: "Lower Parel",
        rating: 4.6,
        image:
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&auto=format&fit=crop&q=60",
        price_per_hour: 120,
        capacity: 10,
        slots: ["06:00", "07:00", "08:00", "09:00", "18:00", "19:00"],
      },
      {
        id: "c2",
        name: "Skyline Courts",
        city: "Mumbai",
        sport: "Basketball",
        location: "Bandra West",
        rating: 4.4,
        image:
          "https://images.unsplash.com/photo-1518600506278-4e8ef466b810?w=1200&auto=format&fit=crop&q=60",
        price_per_hour: 90,
        capacity: 8,
        slots: ["07:00", "08:00", "09:00", "19:00", "20:00"],
      },
      {
        id: "c3",
        name: "Court Central",
        city: "Pune",
        sport: "Tennis",
        location: "Koregaon Park",
        rating: 4.8,
        image:
          "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&auto=format&fit=crop&q=60",
        price_per_hour: 60,
        capacity: 4,
        slots: ["06:00", "07:00", "08:00", "17:00"],
      },
      {
        id: "c4",
        name: "Riverside Club",
        city: "Delhi",
        sport: "Badminton",
        location: "Riverside",
        rating: 4.2,
        image:
          "https://images.unsplash.com/photo-1604908554027-783b2abf64f6?w=1200&auto=format&fit=crop&q=60",
        price_per_hour: 45,
        capacity: 4,
        slots: ["08:00", "09:00", "10:00", "18:00"],
      },
      {
        id: "c5",
        name: "Bengaluru Arena",
        city: "Bengaluru",
        sport: "Football",
        location: "Indiranagar",
        rating: 4.5,
        image:
          "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=60",
        price_per_hour: 110,
        capacity: 12,
        slots: ["06:00", "07:00", "20:00", "21:00"],
      },
      {
        id: "c6",
        name: "Powai Sports Hub",
        city: "Mumbai",
        sport: "Tennis",
        location: "Powai",
        rating: 4.1,
        image:
          "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1200&auto=format&fit=crop&q=60",
        price_per_hour: 70,
        capacity: 4,
        slots: ["06:00", "07:00", "08:00", "18:00"],
      },
      {
        id: "c7",
        name: "Pune Hoop House",
        city: "Pune",
        sport: "Basketball",
        location: "Aundh",
        rating: 4.3,
        image:
          "https://images.unsplash.com/photo-1483721310020-03333e577078?w=1200&auto=format&fit=crop&q=60",
        price_per_hour: 85,
        capacity: 10,
        slots: ["07:00", "08:00", "09:00", "17:00", "18:00"],
      },
      {
        id: "c8",
        name: "Delhi Smash Centre",
        city: "Delhi",
        sport: "Badminton",
        location: "Dwarka",
        rating: 4.0,
        image:
          "https://images.unsplash.com/photo-1591579150219-6cac44cb4e60?w=1200&auto=format&fit=crop&q=60",
        price_per_hour: 50,
        capacity: 4,
        slots: ["08:00", "09:00", "10:00", "19:00"],
      },
    ],
    []
  );

  // Filter states - START WITH EMPTY VALUES
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedCourtName, setSelectedCourtName] = useState("");

  // Get unique cities and sports from courts data
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(courts.map((court) => court.city))].sort();
    return ["All Cities", ...uniqueCities];
  }, [courts]);

  const sports = useMemo(() => {
    const uniqueSports = [
      ...new Set(courts.map((court) => court.sport)),
    ].sort();
    return ["All Sports", ...uniqueSports];
  }, [courts]);

  // WORKING FILTER LOGIC
  const filteredCourts = useMemo(() => {
    console.log("Filtering with:", {
      selectedCity,
      selectedSport,
      selectedCourtName,
    });

    let filtered = courts;

    // Filter by city
    if (selectedCity && selectedCity !== "All Cities") {
      filtered = filtered.filter((court) => court.city === selectedCity);
    }

    // Filter by sport
    if (selectedSport && selectedSport !== "All Sports") {
      filtered = filtered.filter((court) => court.sport === selectedSport);
    }

    console.log("Filtered result:", filtered);
    return filtered;
  }, [courts, selectedCity, selectedSport]);

  // Get court names for the third dropdown
  const availableCourtNames = useMemo(() => {
    return filteredCourts.map((court) => court.name);
  }, [filteredCourts]);

  // Get selected court object
  const selectedCourt = useMemo(() => {
    return courts.find((court) => court.name === selectedCourtName) || null;
  }, [courts, selectedCourtName]);

  // Handle filter changes with animation
  const handleCityChange = (newCity) => {
    console.log("City changed to:", newCity);
    setIsFiltering(true);
    setSelectedCity(newCity);
    setSelectedCourtName(""); // Reset court selection when city changes
    setCourtAnimationKey((prev) => prev + 1);

    setTimeout(() => {
      setIsFiltering(false);
    }, 300);
  };

  const handleSportChange = (newSport) => {
    console.log("Sport changed to:", newSport);
    setIsFiltering(true);
    setSelectedSport(newSport);
    setSelectedCourtName(""); // Reset court selection when sport changes
    setCourtAnimationKey((prev) => prev + 1);

    setTimeout(() => {
      setIsFiltering(false);
    }, 300);
  };

  const handleCourtChange = (newCourt) => {
    console.log("Court changed to:", newCourt);
    setSelectedCourtName(newCourt);
  };

  // Step 2 state
  const [selectedSlot, setSelectedSlot] = useState("");
  const [numPlayers, setNumPlayers] = useState(1);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Step 3 state
  const [paymentMethod, setPaymentMethod] = useState("Pay on Visit");

  const perPersonCharge = selectedCourt ? selectedCourt.price_per_hour : 0;
  const totalCharge = perPersonCharge * (Number(numPlayers) || 0);

  const canGoNext = () => {
    if (step === 1) {
      return Boolean(selectedCourtName && selectedCity && selectedSport);
    }
    if (step === 2) {
      const hasSlot = Boolean(selectedSlot);
      const hasCustomRange = Boolean(
        startTime && endTime && endTime > startTime
      );
      return Boolean(
        selectedCourt && (hasSlot || hasCustomRange) && numPlayers > 0
      );
    }
    if (step === 3) return Boolean(paymentMethod);
    return false;
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    if (step < 3) {
      setStep(step + 1);
    } else {
      alert(`Booking confirmed! 
Court: ${selectedCourt.name}
Time: ${startTime} - ${endTime}
Players: ${numPlayers}
Total: ₹${totalCharge}
Payment: ${paymentMethod}`);
      setShowWizard(false);
      resetForm();
    }
  };

  const handleBack = () => setStep(Math.max(1, step - 1));

  const resetForm = () => {
    setStep(1);
    setSelectedCity("");
    setSelectedSport("");
    setSelectedCourtName("");
    setSelectedSlot("");
    setNumPlayers(1);
    setStartTime("");
    setEndTime("");
    setPaymentMethod("Pay on Visit");
  };

  const Stepper = () => (
    <div className="stepper">
      {[1, 2, 3].map((s, idx) => (
        <div
          key={s}
          className={`step ${
            step === s ? "step-active" : step > s ? "step-done" : ""
          }`}
        >
          <div
            className="step-index"
            style={{
              borderColor: THEME,
              color: step >= s ? "#fff" : THEME,
              background: step >= s ? THEME : "transparent",
            }}
          >
            {s}
          </div>
          <div className="step-label">
            {s === 1 ? "Choose Court" : s === 2 ? "Choose Slot" : "Payment"}
          </div>
          {idx < 2 && <div className="step-line" />}
        </div>
      ))}
    </div>
  );

  const RatingStars = ({ rating = 0 }) => {
    const stars = Array.from({ length: 5 });
    return (
      <div className="rating">
        {stars.map((_, i) => (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill={i < Math.round(rating) ? "#FBBF24" : "#E5E7EB"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const LocationIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={THEME}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );

  return (
    <div className="my-bookings-page">
      <Header showNavigation />
      <div className="bookings-container fade-in">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          <Button
            variant="primary"
            onClick={() => {
              setShowWizard(true);
              resetForm();
            }}
          >
            + Create New Booking
          </Button>
        </div>

        <div className="bookings-tabs">
          <button
            className={`tab-button ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming ({bookings.upcoming.length})
          </button>
          <button
            className={`tab-button ${activeTab === "past" ? "active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Past ({bookings.past.length})
          </button>
          <button
            className={`tab-button ${
              activeTab === "cancelled" ? "active" : ""
            }`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled ({bookings.cancelled.length})
          </button>
        </div>

        <div className="bookings-content">
          {bookings[activeTab].length === 0 ? (
            <div className="no-bookings">
              <p>No {activeTab} bookings found.</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings[activeTab].map((b) => (
                <div key={b.id} className="booking-card">
                  <div className="booking-header">
                    <div className="venue-info">
                      <img
                        src={b.venueImage}
                        alt={b.venueName}
                        className="venue-thumbnail"
                      />
                      <div>
                        <div className="sport-row">
                          <span className="sport-pill">{b.sportName}</span>
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(b.status),
                            }}
                          >
                            {getStatusText(b.status)}
                          </span>
                        </div>
                        <h3>{b.venueName}</h3>
                        <p className="venue-location">{b.venueLocation}</p>
                        <p className="booking-id">#{b.bookingId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="detail-label">Price per hour</span>
                      <span className="detail-value">₹{b.price_per_hour}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Date</span>
                      <span className="detail-value">
                        {new Date(b.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Time</span>
                      <span className="detail-value">{b.time}</span>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => {
                        setSelectedBooking({
                          booking_ref: b.bookingId,
                          status: b.status,
                          start_at: b.date,
                          end_at: b.date,
                          location: b.venueLocation,
                          total_amount: b.price_per_hour,
                          price_per_hour: b.price_per_hour,
                          sport_type: b.sportName,
                        });
                        setShowDetails(true);
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => {
                        setSelectedBooking({
                          booking_ref: b.bookingId,
                          status: b.status,
                          start_at: b.date,
                          end_at: b.date,
                          total_amount: b.price_per_hour,
                        });
                        setEditMode("edit");
                        setShowEdit(true);
                      }}
                    >
                      Edit
                    </Button>

                    {/* Conditionally show Review button for completed bookings */}
                    {isBookingCompleted(b) ? (
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => {
                          setSelectedBookingForReview(b);
                          setShowReview(true);
                        }}
                      >
                        Review
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="small"
                        onClick={() => alert("Cancel request submitted")}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showWizard && (
        <div className="modal-overlay">
          <div className="modal-content booking-modal">
            <div className="modal-header">
              <h2>New Booking</h2>
              <button
                className="close-button"
                onClick={() => setShowWizard(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="wizard-header">
                <p>Complete the steps to place your booking</p>
              </div>
              <Stepper />

              <div className={`step-content step-${step}`}>
                {step === 1 && (
                  <div className="step-panel">
                    <div className="filters-row">
                      <div className="filter-container">
                        <label>City</label>
                        <Select
                          placeholder="Select City"
                          options={cities}
                          value={selectedCity}
                          onChange={handleCityChange}
                        />
                      </div>
                      <div className="filter-container">
                        <label>Sport</label>
                        <Select
                          placeholder="Select Sport"
                          options={sports}
                          value={selectedSport}
                          onChange={handleSportChange}
                        />
                      </div>
                      <div className="filter-container">
                        <label>Court</label>
                        <Select
                          placeholder="Select Court"
                          options={availableCourtNames}
                          value={selectedCourtName}
                          onChange={handleCourtChange}
                          disabled={filteredCourts.length === 0}
                        />
                      </div>
                    </div>

                    <div className="courts-container">
                      <div className="filter-summary">
                        <span>
                          {filteredCourts.length} court
                          {filteredCourts.length !== 1 ? "s" : ""} found
                          {selectedCity && selectedCity !== "All Cities"
                            ? ` in ${selectedCity}`
                            : ""}
                          {selectedSport && selectedSport !== "All Sports"
                            ? ` for ${selectedSport}`
                            : ""}
                        </span>
                      </div>

                      <div
                        className={`courts-grid ${
                          isFiltering ? "filtering" : ""
                        }`}
                        key={courtAnimationKey}
                      >
                        {filteredCourts.map((c, index) => (
                          <div
                            key={c.id}
                            className={`court-card ${
                              selectedCourt && selectedCourt.id === c.id
                                ? "court-card-active"
                                : ""
                            }`}
                            onClick={() => handleCourtChange(c.name)}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <img
                              className="court-image"
                              src={c.image}
                              alt={c.name}
                            />
                            <div className="court-content">
                              <div className="court-header">
                                <h3>{c.name}</h3>
                                <RatingStars rating={c.rating} />
                              </div>
                              <div className="court-badges">
                                <span className="sport-badge">{c.sport}</span>
                                <span className="city-badge">{c.city}</span>
                              </div>
                              <div className="court-meta">
                                <span className="meta-item">
                                  <LocationIcon /> {c.location}
                                </span>
                                <span className="meta-item">
                                  ₹{c.price_per_hour}/hr
                                </span>
                                <span className="meta-item">
                                  Cap {c.capacity}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {filteredCourts.length === 0 && (
                          <div className="empty-note">
                            No courts match your filters. Try adjusting your
                            selection.
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="nav-row">
                      <div />
                      <Button
                        variant="primary"
                        disabled={!canGoNext()}
                        onClick={handleNext}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && selectedCourt && (
                  <div className="step-panel">
                    <div className="selected-court-summary">
                      <h4>Selected Court: {selectedCourt.name}</h4>
                      <p>
                        {selectedCourt.location}, {selectedCourt.city}
                      </p>
                    </div>

                    <div className="slots-grid">
                      {selectedCourt.slots.map((t) => (
                        <button
                          key={t}
                          className={`slot-card ${
                            selectedSlot === t ? "slot-active" : ""
                          }`}
                          onClick={() => {
                            setSelectedSlot(t);
                            setStartTime(t);
                            const [h, m] = t.split(":").map(Number);
                            const endH = ((h + 1) % 24)
                              .toString()
                              .padStart(2, "0");
                            setEndTime(
                              `${endH}:${m.toString().padStart(2, "0")}`
                            );
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="inputs-row">
                      <div className="input-group">
                        <label>Number of Players</label>
                        <Input
                          type="number"
                          min={1}
                          max={selectedCourt.capacity}
                          value={numPlayers}
                          onChange={(e) =>
                            setNumPlayers(
                              Math.min(
                                Number(e.target.value),
                                selectedCourt.capacity
                              )
                            )
                          }
                        />
                        <small>Max {selectedCourt.capacity} players</small>
                      </div>
                      <div className="input-group">
                        <label>Start Time</label>
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => {
                            setStartTime(e.target.value);
                            setSelectedSlot("");
                          }}
                        />
                      </div>
                      <div className="input-group">
                        <label>End Time</label>
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => {
                            setEndTime(e.target.value);
                            setSelectedSlot("");
                          }}
                        />
                      </div>
                    </div>

                    <div className="nav-row">
                      <Button variant="secondary" onClick={handleBack}>
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        disabled={!canGoNext()}
                        onClick={handleNext}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && !selectedCourt && (
                  <div className="step-panel">
                    <div className="empty-note">
                      Please select a court in Step 1.
                    </div>
                    <div className="nav-row">
                      <Button variant="secondary" onClick={handleBack}>
                        Back
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && selectedCourt && (
                  <div className="step-panel">
                    <div className="booking-summary">
                      <h4>Booking Summary</h4>
                      <div className="summary-item">
                        <span>Court:</span>
                        <strong>{selectedCourt.name}</strong>
                      </div>
                      <div className="summary-item">
                        <span>Date:</span>
                        <strong>{date || "Today"}</strong>
                      </div>
                      <div className="summary-item">
                        <span>Time:</span>
                        <strong>
                          {startTime} - {endTime}
                        </strong>
                      </div>
                      <div className="summary-item">
                        <span>Players:</span>
                        <strong>{numPlayers}</strong>
                      </div>
                    </div>

                    <div className="payment-grid">
                      <div className="charge-card">
                        <div className="charge-row">
                          <span>Per person</span>
                          <strong>₹{perPersonCharge.toFixed(2)}</strong>
                        </div>
                        <div className="charge-row">
                          <span>Players</span>
                          <strong>{numPlayers}</strong>
                        </div>
                        <div className="charge-divider" />
                        <div className="charge-row total">
                          <span>Total</span>
                          <strong>₹{totalCharge.toFixed(2)}</strong>
                        </div>
                      </div>
                      <div className="payment-card">
                        <div className="input-group">
                          <label>Payment Method</label>
                          <select
                            className="native-select"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          >
                            <option>Pay on Visit</option>
                            <option>Pay Online</option>
                            <option>UPI</option>
                          </select>
                        </div>
                        <div className="summary-note">
                          You will pay at the venue. Please arrive 10 minutes
                          early.
                        </div>
                      </div>
                    </div>
                    <div className="nav-row">
                      <Button variant="secondary" onClick={handleBack}>
                        Back
                      </Button>
                      <Button
                        variant="primary"
                        disabled={!canGoNext()}
                        onClick={handleNext}
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && !selectedCourt && (
                  <div className="step-panel">
                    <div className="empty-note">
                      Please select a court in Step 1.
                    </div>
                    <div className="nav-row">
                      <Button variant="secondary" onClick={handleBack}>
                        Back
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetails && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setShowDetails(false)}
        />
      )}
      {showEdit && (
        <BookingEditModal
          booking={selectedBooking}
          mode={editMode}
          onSave={() => setShowEdit(false)}
          onClose={() => setShowEdit(false)}
        />
      )}
      {showReview && (
        <ReviewModal
          booking={selectedBookingForReview}
          onSubmit={handleReviewSubmit}
          onClose={() => {
            setShowReview(false);
            setSelectedBookingForReview(null);
          }}
        />
      )}
    </div>
  );
};
export default MyBookingsPage;
