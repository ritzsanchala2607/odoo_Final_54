import React, { useState } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import './VenuesPage.css';

const VenuesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Conference Halls', 'Meeting Rooms', 'Event Spaces', 'Auditoriums', 'Outdoor Venues'];

  const venues = [
    {
      id: 1,
      name: 'Grand Conference Center',
      category: 'Conference Halls',
      location: 'Downtown Business District',
      capacity: '500 people',
      price: '$200/hour',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
      description: 'State-of-the-art conference facility with modern amenities and professional staff.',
      available: true
    },
    {
      id: 2,
      name: 'Skyline Meeting Room',
      category: 'Meeting Rooms',
      location: 'Financial District',
      capacity: '50 people',
      price: '$80/hour',
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop',
      description: 'Elegant meeting room with panoramic city views and premium audio-visual equipment.',
      available: true
    },
    {
      id: 3,
      name: 'Riverside Event Space',
      category: 'Event Spaces',
      location: 'Waterfront Area',
      capacity: '200 people',
      price: '$150/hour',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
      description: 'Beautiful waterfront venue perfect for corporate events and social gatherings.',
      available: false
    },
    {
      id: 4,
      name: 'Tech Auditorium',
      category: 'Auditoriums',
      location: 'Innovation Hub',
      capacity: '300 people',
      price: '$120/hour',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
      description: 'Modern auditorium equipped with cutting-edge presentation technology.',
      available: true
    },
    {
      id: 5,
      name: 'Garden Pavilion',
      category: 'Outdoor Venues',
      location: 'Central Park',
      capacity: '150 people',
      price: '$100/hour',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
      description: 'Scenic outdoor venue surrounded by nature, perfect for summer events.',
      available: true
    }
  ];

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || venue.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookVenue = (venueId) => {
    console.log(`Booking venue ${venueId}`);
    // This would integrate with booking functionality
    alert(`Booking request sent for ${venues.find(v => v.id === venueId)?.name}`);
  };

  return (
    <div className="venues-page">
      <Header showNavigation />
      <div className="venues-container fade-in">
        <div className="venues-header">
          <h1>Find Your Perfect Venue</h1>
          <p>Discover and book amazing spaces for your next event</p>
        </div>

        <div className="search-and-filter">
          <div className="search-section">
            <Input
              type="text"
              placeholder="Search venues by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="category-filter">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="venues-grid">
          {filteredVenues.map((venue) => (
            <div key={venue.id} className={`venue-card ${!venue.available ? 'unavailable' : ''}`}>
              <div className="venue-image">
                <img src={venue.image} alt={venue.name} />
                {!venue.available && <div className="unavailable-badge">Unavailable</div>}
              </div>
              
              <div className="venue-content">
                <h3>{venue.name}</h3>
                <p className="venue-category">{venue.category}</p>
                <p className="venue-location">📍 {venue.location}</p>
                <p className="venue-capacity">👥 {venue.capacity}</p>
                <p className="venue-price">💰 {venue.price}</p>
                <p className="venue-description">{venue.description}</p>
                
                <div className="venue-actions">
                  <Button 
                    onClick={() => handleBookVenue(venue.id)}
                    disabled={!venue.available}
                    variant={venue.available ? "primary" : "secondary"}
                    fullWidth
                  >
                    {venue.available ? 'Book Now' : 'Currently Unavailable'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="no-venues">
            <p>No venues found matching your criteria.</p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }} variant="secondary">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenuesPage;
