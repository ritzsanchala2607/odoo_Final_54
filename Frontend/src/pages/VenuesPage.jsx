// import React, { useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import Header from '../components/Header';
// import Button from '../components/Button';
// import Input from '../components/Input';
// import './VenuesPage.css';

// const VenuesPage = () => {
//   const navigate = useNavigate();

//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [priceRange, setPriceRange] = useState([0, 5500]);
//   const [venueType, setVenueType] = useState('');
//   const [rating, setRating] = useState('');
//   const [distanceFilters, setDistanceFilters] = useState([]); // ✅ Multiple distance selections

//   const categories = ['All', 'Conference Halls', 'Meeting Rooms', 'Event Spaces', 'Auditoriums', 'Outdoor Venues'];

//   const venues = [
//     {
//       id: 1,
//       name: 'Grand Conference Center',
//       category: 'Conference Halls',
//       location: 'Downtown Business District',
//       capacity: '500 people',
//       price: 200,
//       image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
//       description: 'State-of-the-art conference facility with modern amenities and professional staff.',
//       available: true,
//       rating: 4.5,
//       type: 'Indoor',
//       distance: 4 // km
//     },
//     {
//       id: 2,
//       name: 'Skyline Meeting Room',
//       category: 'Meeting Rooms',
//       location: 'Financial District',
//       capacity: '50 people',
//       price: 80,
//       image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop',
//       description: 'Elegant meeting room with panoramic city views and premium audio-visual equipment.',
//       available: true,
//       rating: 4.0,
//       type: 'Indoor',
//       distance: 12 // km
//     }, {
//       id: 3,
//       name: 'City Park Outdoor Arena',
//       category: 'Outdoor Venues',
//       location: 'Central City Park',
//       capacity: '2000 people',
//       price: 500,
//       image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
//       description: 'Spacious outdoor arena suitable for concerts, sports events, and exhibitions.',
//       available: true,
//       rating: 4.3,
//       type: 'Outdoor',
//       distance: 8
//     },
//     {
//       id: 4,
//       name: 'Tech Auditorium',
//       category: 'Auditoriums',
//       location: 'Tech Valley',
//       capacity: '800 people',
//       price: 350,
//       image: 'https://images.unsplash.com/photo-1503428593586-e225b39bddfe?w=400&h=300&fit=crop',
//       description: 'High-tech auditorium with advanced lighting and audio system.',
//       available: true,
//       rating: 4.7,
//       type: 'Indoor',
//       distance: 15
//     },
//     {
//       id: 5,
//       name: 'Riverside Event Space',
//       category: 'Event Spaces',
//       location: 'Riverfront Avenue',
//       capacity: '300 people',
//       price: 150,
//       image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=400&h=300&fit=crop',
//       description: 'Scenic riverside location for weddings, parties, and corporate gatherings.',
//       available: true,
//       rating: 4.2,
//       type: 'Outdoor',
//       distance: 5
//     },
//     {
//       id: 6,
//       name: 'Executive Boardroom',
//       category: 'Meeting Rooms',
//       location: 'Corporate Plaza',
//       capacity: '20 people',
//       price: 120,
//       image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=400&h=300&fit=crop',
//       description: 'Premium boardroom with high-speed internet and video conferencing.',
//       available: true,
//       rating: 4.8,
//       type: 'Indoor',
//       distance: 3
//     }
//     // Add more venues here...
//   ];

//   // ✅ Handle Distance Checkbox
//   const handleDistanceChange = (value) => {
//     setDistanceFilters(prev =>
//       prev.includes(value) ? prev.filter(d => d !== value) : [...prev, value]
//     );
//   };

//   // ✅ Filtering Logic
//   const filteredVenues = venues.filter(venue => {
//     const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       venue.location.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory === 'All' || venue.category === selectedCategory;
//     const matchesPrice = venue.price >= priceRange[0] && venue.price <= priceRange[1];
//     const matchesType = !venueType || venue.type === venueType;
//     const matchesRating = !rating || venue.rating >= rating;
//     const matchesDistance =
//       distanceFilters.length === 0 ||
//       distanceFilters.some(limit => venue.distance <= limit);

//     return matchesSearch && matchesCategory && matchesPrice && matchesType && matchesRating && matchesDistance;
//   });

//   return (
//     <div className="venues-page">
//       <Header showNavigation />

//       <div className="venues-layout">

//         {/* Sidebar Filters */}
//         <aside className="sidebar">
//           <h3>Search by venue name</h3>
//           <Input
//             type="text"
//             placeholder="Search for venue"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />

//           <h3>Filter by sport type</h3>
//           <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
//             {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
//           </select>

//           <h3>Price range (per hour)</h3>
//           <input
//             type="range"
//             min="0"
//             max="5500"
//             value={priceRange[1]}
//             onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
//           />
//           <div>₹{priceRange[0]} - ₹{priceRange[1]}</div>

//           <h3>Choose Venue Type</h3>
//           <label><input type="radio" name="type" onChange={() => setVenueType('Indoor')} /> Indoor</label>
//           <label><input type="radio" name="type" onChange={() => setVenueType('Outdoor')} /> Outdoor</label>

//           <h3>Rating</h3>
//           {[4, 3, 2, 1].map(r => (
//             <label key={r}>
//               <input type="checkbox" onChange={() => setRating(r)} /> {r} stars & up
//             </label>
//           ))}

//           {/* ✅ Distance Filter with Checkboxes */}
//           <h3>Distance (Around me)</h3>
//           <label>
//             <input
//               type="checkbox"
//               checked={distanceFilters.includes(5)}
//               onChange={() => handleDistanceChange(5)}
//             /> Within 5 km
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               checked={distanceFilters.includes(10)}
//               onChange={() => handleDistanceChange(10)}
//             /> Within 10 km
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               checked={distanceFilters.includes(20)}
//               onChange={() => handleDistanceChange(20)}
//             /> Within 20 km
//           </label>

//           <Button variant="secondary" onClick={() => {
//             setSearchQuery('');
//             setSelectedCategory('All');
//             setPriceRange([0, 5500]);
//             setVenueType('');
//             setRating('');
//             setDistanceFilters([]);
//           }}>Clear Filters</Button>
//         </aside>

//         {/* Main Content */}
//         <main className="venues-content">
//           <h2 className="page-title">Sports Venues in Ahmedabad: Discover and Book Nearby Venues</h2>

//           <div className="venues-grid">
//             {filteredVenues.map(venue => (
//               <div key={venue.id} className="venue-card">
//                 <div className="venue-image">
//                   <img src={venue.image} alt={venue.name} />
//                 </div>
//                 <div className="venue-info">
//                   <h4>{venue.name}</h4>
//                   <p>📍 {venue.location}</p>
//                   <p>₹ {venue.price} per hour</p>
//                   <p>⭐ {venue.rating}</p>
//                   <p>📏 {venue.distance} km away</p>
//                   <Button variant="primary" onClick={() => navigate(`/venue/${venue.id}`)}> View Details </Button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           <div className="pagination">
//             <button>{'<'}</button>
//             <button className="active">1</button>
//             <button>2</button>
//             <button>3</button>
//             <button>{'>'}</button>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default VenuesPage;

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

        {/* Main Content */}
        <main className="venues-content">
          {/* <h2 className="page-title">
            Sports Venues in Ahmedabad: Discover and Book Nearby Venues
          </h2> */}

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
