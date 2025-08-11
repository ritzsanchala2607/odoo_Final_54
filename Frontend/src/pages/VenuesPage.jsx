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
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5500]);
  const [rating, setRating] = useState("");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Badminton",
    "Table Tennis",
    "Cricket",
    "Football",
    "Tennis",
    "Other",
  ];

  // Fetch courts then aggregate into venues
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/courts/all`);
        const courts = res.data.courts || [];

        const aggregatedByVenue = new Map();

        for (const court of courts) {
          const v = court.venue;
          if (!v) continue;
          const venueId = v.id;
          const existing = aggregatedByVenue.get(venueId) || {
            id: venueId,
            name: v.name,
            location: v.address || v.city || "",
            rating: Number(v.rating_avg) || 0,
            image: "https://via.placeholder.com/400x300?text=Venue+Image",
            available: true,
            categories: new Set(),
            minPrice: Number.POSITIVE_INFINITY,
            courtsCount: 0,
          };

          existing.courtsCount += 1;
          existing.categories.add(court.sport_type || "Other");
          const price = Number(court.price_per_hour || 0);
          if (!Number.isNaN(price)) existing.minPrice = Math.min(existing.minPrice, price);

          aggregatedByVenue.set(venueId, existing);
        }

        const aggregatedList = Array.from(aggregatedByVenue.values()).map((v) => ({
          id: v.id,
          name: v.name,
          category: (v.categories.size === 1 ? Array.from(v.categories)[0] : "Mixed"),
          categories: Array.from(v.categories),
          location: v.location,
          capacity: v.courtsCount ? `${v.courtsCount} courts` : "",
          price: v.minPrice === Number.POSITIVE_INFINITY ? 0 : v.minPrice,
          rating: v.rating,
          type: "Venue",
          distance: 0,
          image: v.image,
          available: v.available,
        }));

        setVenues(aggregatedList);
      } catch (error) {
        console.error("Error fetching courts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  // Filtering Logic
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || (venue.categories || []).includes(selectedCategory) || venue.category === selectedCategory;
    const matchesPrice = venue.price >= priceRange[0] && venue.price <= priceRange[1];
    const matchesRating = !rating || venue.rating >= rating;
    const matchesLocation = (venue.location || "").toLowerCase().includes(locationQuery.toLowerCase());

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesRating &&
      matchesLocation
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

          <h3>Rating</h3>
          {[4, 3, 2, 1].map((r) => (
            <label key={r}>
              <input type="checkbox" onChange={() => setRating(r)} /> {r} stars
              & up
            </label>
          ))}

          <h3>Filter by location</h3>
          <Input
            type="text"
            placeholder="Enter location, e.g., Sargasan"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />


          <Button
            variant="secondary"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setPriceRange([0, 5500]);

              setRating("");
              setLocationQuery("");
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
                      {venue.categories && venue.categories.length > 0 && (
                        <p>
                          <strong>Sports:</strong> {venue.categories.join(", ")}
                        </p>
                      )}
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
