import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Button from "../components/Button";
import Input from "../components/Input";
import "./VenuesPage.css";

const VenuesPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5500]);
  const [venueType, setVenueType] = useState("");
  const [rating, setRating] = useState("");
  const [distanceFilters, setDistanceFilters] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Conference Halls",
    "Meeting Rooms",
    "Event Spaces",
    "Auditoriums",
    "Outdoor Venues",
  ];

  // ✅ Fetch data from API
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/courts/all`);
        // Your backend returns { courts: [...] }
        const mapped = res.data.courts.map((court) => ({
          id: court.id,
          name: court.name,
          category: court.sport_type || "Other",
          location: court.venue?.address || court.venue?.name || "Unknown",
          capacity: court.capacity ? `${court.capacity} people` : "",
          price: court.price_per_hour || 0,
          rating: court.venue?.rating || 0,
          type: court.venue?.venue_type || "Indoor",
          distance: court.venue?.distance || 0,
          image:
            court.venue?.image_url ||
            "https://via.placeholder.com/400x300?text=Venue+Image",
          available: court.is_active,
        }));
        setVenues(mapped);
      } catch (error) {
        console.error("Error fetching courts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  // ✅ Handle Distance Checkbox
  const handleDistanceChange = (value) => {
    setDistanceFilters((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  // ✅ Filtering Logic
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || venue.category === selectedCategory;
    const matchesPrice =
      venue.price >= priceRange[0] && venue.price <= priceRange[1];
    const matchesType = !venueType || venue.type === venueType;
    const matchesRating = !rating || venue.rating >= rating;
    const matchesDistance =
      distanceFilters.length === 0 ||
      distanceFilters.some((limit) => venue.distance <= limit);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesType &&
      matchesRating &&
      matchesDistance
    );
  });

  return (
    <div className="venues-page">
      <Header showNavigation />

      <div className="venues-layout">
        {/* Sidebar Filters */}
        <aside className="sidebar">
          <h3>Search by venue name</h3>
          <Input
            type="text"
            placeholder="Search for venue"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <h3>Filter by sport type</h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <h3>Price range (per hour)</h3>
          <input
            type="range"
            min="0"
            max="5500"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          />
          <div>
            ₹{priceRange[0]} - ₹{priceRange[1]}
          </div>

          <h3>Choose Venue Type</h3>
          <label>
            <input
              type="radio"
              name="type"
              onChange={() => setVenueType("Indoor")}
            />{" "}
            Indoor
          </label>
          <label>
            <input
              type="radio"
              name="type"
              onChange={() => setVenueType("Outdoor")}
            />{" "}
            Outdoor
          </label>

          <h3>Rating</h3>
          {[4, 3, 2, 1].map((r) => (
            <label key={r}>
              <input type="checkbox" onChange={() => setRating(r)} /> {r} stars
              & up
            </label>
          ))}

          <h3>Distance (Around me)</h3>
          {[5, 10, 20].map((dist) => (
            <label key={dist}>
              <input
                type="checkbox"
                checked={distanceFilters.includes(dist)}
                onChange={() => handleDistanceChange(dist)}
              />{" "}
              Within {dist} km
            </label>
          ))}

          <Button
            variant="secondary"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setPriceRange([0, 5500]);
              setVenueType("");
              setRating("");
              setDistanceFilters([]);
            }}
          >
            Clear Filters
          </Button>
        </aside>

        <main className="venues-content">
          {loading ? (
            <p>Loading venues...</p>
          ) : (
            <div className="venues-grid">
              {filteredVenues.length > 0 ? (
                filteredVenues.map((venue) => (
                  <div key={venue.id} className="venue-card">
                    <div className="venue-image">
                      <img src={venue.image} alt={venue.name} />
                    </div>
                    <div className="venue-info">
                      <h4>{venue.name}</h4>
                      <p>
                        <strong>Location:</strong> {venue.location}
                      </p>
                      <p>
                        <strong>Price:</strong> ₹ {venue.price} per hour
                      </p>
                      <p>
                        <strong>Rating:</strong> {venue.rating}
                      </p>
                      <p>
                        <strong>Distance:</strong> {venue.distance} km away
                      </p>
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/venue/${venue.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No venues found matching your filters.</p>
              )}
            </div>
          )}

          {/* Pagination (Static Example) */}
          <div className="pagination">
            <button>{"<"}</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>{">"}</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VenuesPage;
