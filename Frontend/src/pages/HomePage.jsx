import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  // Demo data
  const venues = useMemo(() => ([
    { id: 1, name: 'City Sports Arena', rating: 4.7, sports: ['🏀', '🏸', '⚽️'], location: 'Downtown', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1000&auto=format&fit=crop&q=60' },
    { id: 2, name: 'Greenfield Courts', rating: 4.5, sports: ['🎾', '🏸'], location: 'Greenfield Ave', image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1000&auto=format&fit=crop&q=60' },
    { id: 3, name: 'Skyline Sports Hub', rating: 4.8, sports: ['⚽️', '🏀'], location: 'Skyline Road', image: 'https://images.unsplash.com/photo-1518600506278-4e8ef466b810?w=1000&auto=format&fit=crop&q=60' },
    { id: 4, name: 'Riverside Club', rating: 4.4, sports: ['🎾', '🏸', '🏐'], location: 'Riverside', image: 'https://images.unsplash.com/photo-1604908554027-783b2abf64f6?w=1000&auto=format&fit=crop&q=60' },
    { id: 5, name: 'Arena 5', rating: 4.2, sports: ['⚽️', '🏀'], location: 'Uptown', image: 'https://images.unsplash.com/photo-1521417531039-96cce66f7d50?w=1000&auto=format&fit=crop&q=60' },
    { id: 6, name: 'Court Central', rating: 4.9, sports: ['🎾', '🏸'], location: 'Central Park', image: 'https://images.unsplash.com/photo-1521417531039-96cce66f7d50?w=1000&auto=format&fit=crop&q=60' },
  ]), []);

  const sports = useMemo(() => ([
    { id: 'football', name: 'Football', tagline: '5v5 • 7v7 • 11v11', image: 'https://images.unsplash.com/photo-1542541864-4abf21a55761?w=1200&q=60&auto=format&fit=crop', gradient: 'linear-gradient(135deg,#10b981,#34d399)' },
    { id: 'basketball', name: 'Basketball', tagline: 'Courts near you', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=60&auto=format&fit=crop', gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
    { id: 'tennis', name: 'Tennis', tagline: 'Clay • Grass • Hard', image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&q=60&auto=format&fit=crop', gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)' },
    { id: 'badminton', name: 'Badminton', tagline: 'Indoor courts', image: 'https://images.unsplash.com/photo-1604908554027-783b2abf64f6?w=1200&q=60&auto=format&fit=crop', gradient: 'linear-gradient(135deg,#ec4899,#f472b6)' },
  ]), []);

  const matches = useMemo(() => ([
    { id: 1, sport: 'Football', icon: '⚽️', when: 'Today 6:30 PM', where: 'City Park', level: 'Intermediate', spots: 3 },
    { id: 2, sport: 'Basketball', icon: '🏀', when: 'Tomorrow 7:00 PM', where: 'North Court', level: 'Beginner', spots: 2 },
    { id: 3, sport: 'Tennis', icon: '🎾', when: 'Fri 5:00 PM', where: 'Court Central', level: 'Advanced', spots: 1 },
    { id: 4, sport: 'Badminton', icon: '🏸', when: 'Sat 9:00 AM', where: 'Riverside Club', level: 'All', spots: 4 },
  ]), []);

  const reviews = useMemo(() => ([
    { id: 1, venue: 'City Sports Arena', name: 'Aisha', rating: 5, comment: 'Amazing courts and easy booking!', image: venues[0].image },
    { id: 2, venue: 'Riverside Club', name: 'Karan', rating: 4, comment: 'Clean facilities and friendly staff.', image: venues[3].image },
    { id: 3, venue: 'Court Central', name: 'Liu', rating: 5, comment: 'Best tennis courts in town!', image: venues[5].image },
  ]), [venues]);

  // UI state
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');
  const [visibleVenues, setVisibleVenues] = useState(4);

  const venuesRef = useRef(null);
  const sportsRef = useRef(null);
  const matchesRef = useRef(null);
  const reviewsRef = useRef(null);

  const scrollByAmount = (ref, amount = 320) => {
    if (ref.current) {
      ref.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const onFindPlayers = () => navigate('/mybookings');
  const onFindVenues = () => navigate('/venues');

  return (
    <div className="home-page">
      <Header showNavigation />

      <div className="home-container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-left">
            <h1 className="hero-title">Book Sports Venues. Join Matches. Play More.</h1>
            <p className="hero-subtitle">QuickCourt helps you discover nearby venues and teammates in seconds.</p>

            <div className="search-panel">
              <div className="search-row">
                <Input
                  type="text"
                  placeholder="Enter city or location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Search sport or venue"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="cta-row">
                <Button variant="primary" onClick={onFindPlayers}>Find Players Nearby</Button>
                <Button variant="secondary" onClick={onFindVenues}>Find Venues</Button>
              </div>
            </div>
          </div>

          <div className="hero-map">
            <div className="map-preview" />
            <span className="map-caption">Map preview (demo)</span>
          </div>
        </section>

        {/* Venues Section */}
        <section className="section">
          <div className="section-header">
            <h2>Venues Near You</h2>
            <div className="slider-controls">
              <button className="arrow" onClick={() => scrollByAmount(venuesRef, -360)}>◀</button>
              <button className="arrow" onClick={() => scrollByAmount(venuesRef, 360)}>▶</button>
            </div>
          </div>
          <div className="h-scroll" ref={venuesRef}>
            {venues.slice(0, visibleVenues).map((v) => (
              <div key={v.id} className="venue-card">
                <div className="venue-img" style={{ backgroundImage: `url(${v.image})` }} />
                <div className="venue-body">
                  <div className="venue-top">
                    <h3>{v.name}</h3>
                    <span className="rating">⭐ {v.rating.toFixed(1)}</span>
                  </div>
                  <div className="venue-meta">
                    <div className="sports">{v.sports.join(' ')}</div>
                    <div className="loc">📍 {v.location}</div>
                  </div>
                  <Button variant="primary" fullWidth onClick={() => navigate('/venues')}>Book Now</Button>
                </div>
              </div>
            ))}
          </div>
          {visibleVenues < venues.length && (
            <div className="load-more">
              <Button variant="secondary" onClick={() => setVisibleVenues((c) => Math.min(c + 3, venues.length))}>Load More</Button>
            </div>
          )}
        </section>

        {/* Popular Sports */}
        <section className="section">
          <div className="section-header">
            <h2>Popular Sports in Your Area</h2>
            <div className="slider-controls">
              <button className="arrow" onClick={() => scrollByAmount(sportsRef, -360)}>◀</button>
              <button className="arrow" onClick={() => scrollByAmount(sportsRef, 360)}>▶</button>
            </div>
          </div>
          <div className="h-scroll" ref={sportsRef}>
            {sports.map((s) => (
              <div key={s.id} className="sport-card" style={{ backgroundImage: `url(${s.image})` }}>
                <div className="sport-overlay" style={{ background: s.gradient }} />
                <div className="sport-content">
                  <h3>{s.name}</h3>
                  <p>{s.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Matches / Find Players */}
        <section className="section">
          <div className="section-header">
            <h2>Upcoming Matches • Find Players</h2>
            <div className="slider-controls">
              <button className="arrow" onClick={() => scrollByAmount(matchesRef, -360)}>◀</button>
              <button className="arrow" onClick={() => scrollByAmount(matchesRef, 360)}>▶</button>
            </div>
          </div>
          <div className="h-scroll" ref={matchesRef}>
            {matches.map((m) => (
              <div key={m.id} className="match-card">
                <div className="match-top">
                  <span className="match-icon">{m.icon}</span>
                  <h3>{m.sport}</h3>
                </div>
                <div className="match-meta">🗓 {m.when}</div>
                <div className="match-meta">📍 {m.where}</div>
                <div className="match-meta">🎯 {m.level} • {m.spots} spots left</div>
                <Button variant="primary" fullWidth onClick={onFindPlayers}>Join Match</Button>
              </div>
            ))}
          </div>
        </section>

        {/* Special Offers & Promotions */}
        <section className="section offers">
          <h2>Special Offers & Promotions</h2>
          <div className="offers-grid">
            <div className="offer-card" style={{ background: 'linear-gradient(135deg,#10b981,#34d399)' }}>
              <h3>Weekend Football Bonanza</h3>
              <p>Up to 20% off on football turfs this weekend.</p>
              <Button variant="secondary">Explore</Button>
            </div>
            <div className="offer-card" style={{ background: 'linear-gradient(135deg,#3b82f6,#60a5fa)' }}>
              <h3>Basketball Court Hours</h3>
              <p>Buy 2 hours, get 1 hour free on weekdays.</p>
              <Button variant="secondary">Grab Now</Button>
            </div>
            <div className="offer-card" style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }}>
              <h3>Tennis Season Pass</h3>
              <p>Save up to 30% with monthly passes.</p>
              <Button variant="secondary">View Plans</Button>
            </div>
          </div>
        </section>

        {/* User Reviews */}
        <section className="section">
          <div className="section-header">
            <h2>User Reviews & Highlights</h2>
            <div className="slider-controls">
              <button className="arrow" onClick={() => scrollByAmount(reviewsRef, -360)}>◀</button>
              <button className="arrow" onClick={() => scrollByAmount(reviewsRef, 360)}>▶</button>
            </div>
          </div>
          <div className="h-scroll" ref={reviewsRef}>
            {reviews.map((r) => (
              <div key={r.id} className="review-card">
                <div className="review-image" style={{ backgroundImage: `url(${r.image})` }} />
                <div className="review-body">
                  <div className="review-top">
                    <h3>{r.venue}</h3>
                    <span className="rating">⭐ {r.rating.toFixed(1)}</span>
                  </div>
                  <p className="review-text">“{r.comment}”</p>
                  <div className="reviewer">— {r.name}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
