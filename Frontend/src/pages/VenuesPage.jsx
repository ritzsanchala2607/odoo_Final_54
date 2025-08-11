import React, { useState } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import './VenuesPage.css';

const VenuesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 5500]);
  const [venueType, setVenueType] = useState('');
  const [rating, setRating] = useState('');

  const categories = ['All', 'Conference Halls', 'Meeting Rooms', 'Event Spaces', 'Auditoriums', 'Outdoor Venues'];

  const venues = [
    {
      id: 1,
      name: 'Grand Conference Center',
      category: 'Conference Halls',
      location: 'Downtown Business District',
      capacity: '500 people',
      price: 200,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
      description: 'State-of-the-art conference facility with modern amenities and professional staff.',
      available: true,
      rating: 4.5,
      type: 'Indoor'
    },
    {
      id: 2,
      name: 'Skyline Meeting Room',
      category: 'Meeting Rooms',
      location: 'Financial District',
      capacity: '50 people',
      price: 80,
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop',
      description: 'Elegant meeting room with panoramic city views and premium audio-visual equipment.',
      available: true,
      rating: 4.0,
      type: 'Indoor'
    }
    // Add more venues here...
  ];

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          venue.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || venue.category === selectedCategory;
    const matchesPrice = venue.price >= priceRange[0] && venue.price <= priceRange[1];
    const matchesType = !venueType || venue.type === venueType;
    const matchesRating = !rating || venue.rating >= rating;
    return matchesSearch && matchesCategory && matchesPrice && matchesType && matchesRating;
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
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <h3>Price range (per hour)</h3>
          <input
            type="range"
            min="0"
            max="5500"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          />
          <div>₹{priceRange[0]} - ₹{priceRange[1]}</div>

          <h3>Choose Venue Type</h3>
          <label><input type="radio" name="type" onChange={() => setVenueType('Indoor')} /> Indoor</label>
          <label><input type="radio" name="type" onChange={() => setVenueType('Outdoor')} /> Outdoor</label>

          <h3>Rating</h3>
          {[4,3,2,1].map(r => (
            <label key={r}>
              <input type="checkbox" onChange={() => setRating(r)} /> {r} stars & up
            </label>
          ))}

          <Button variant="secondary" onClick={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setPriceRange([0, 5500]);
            setVenueType('');
            setRating('');
          }}>Clear Filters</Button>
        </aside>

        {/* Main Content */}
        <main className="venues-content">
          <h2 className="page-title">Sports Venues in Ahmedabad: Discover and Book Nearby Venues</h2>

          <div className="venues-grid">
            {filteredVenues.map(venue => (
              <div key={venue.id} className="venue-card">
                <div className="venue-image">
                  <img src={venue.image} alt={venue.name} />
                </div>
                <div className="venue-info">
                  <h4>{venue.name}</h4>
                  <p>📍 {venue.location}</p>
                  <p>₹ {venue.price} per hour</p>
                  <p>⭐ {venue.rating}</p>
                  <Button variant="primary">View Details</Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button>{'<'}</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>{'>'}</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VenuesPage;
