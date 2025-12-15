// src/components/Homepage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showSelection, setShowSelection] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const navigate = useNavigate();

  const reviews = [
    { name: "Priya Sharma", rating: 5, text: "Found my perfect PG in just 2 days! The verification process made me feel so secure.", location: "Mumbai" },
    { name: "Rahul Verma", rating: 5, text: "As a PG owner, StayEase helped me find quality tenants quickly. Highly recommend!", location: "Bangalore" },
    { name: "Ananya Singh", rating: 4, text: "Great platform with genuine listings. The support team is very responsive.", location: "Pune" },
    { name: "Arjun Patel", rating: 5, text: "Love the filtering options! Found exactly what I needed within my budget.", location: "Delhi" },
  ];

  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
      
      if (position > 400 && position < 1200) {
        setShowSelection(true);
        setShowReviews(false);
      } else if (position >= 1200) {
        setShowReviews(true);
        setShowSelection(false);
      } else {
        setShowSelection(false);
        setShowReviews(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 50 50" width="40" height="40">
              <path d="M 10 30 L 25 15 L 40 30 L 40 42 C 40 44 38 45 37 45 L 13 45 C 12 45 10 44 10 42 Z" 
                    fill="#4ECDC4"/>
              <path d="M 18 35 Q 25 39 32 35" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="20" cy="29" r="1.5" fill="#fff"/>
              <circle cx="30" cy="29" r="1.5" fill="#fff"/>
            </svg>
          </div>
          <span className="logo-text">Stay<span className="logo-ease">Ease</span></span>
        </div>
        <nav className="nav">
          <button onClick={() => navigate('/customer-login')}>Find a PG</button>
          <button onClick={() => navigate('/owner-login')}>List Your PG</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Tired of the PG Headache?</h1>
          <h2 className="hero-subtitle">StayEase has your back.</h2>
          <p className="hero-description">Find verified PGs or list your property with confidence. Trusted by 2,000+ happy customers.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/customer-login')}>
              Search PGs
            </button>
            <button className="btn-secondary" onClick={() => navigate('/owner-login')}>
              List Property
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card">🏠</div>
        </div>
      </section>

      {/* Selection Section */}
      <section className={`selection-section ${showSelection ? 'visible' : ''}`}>
        <h2>What brings you here?</h2>
        <div className="selection-cards">
          <div className="selection-card" onClick={() => navigate('/customer-login')}>
            <div className="card-icon">🔍</div>
            <h3>I'm Looking for a PG</h3>
            <p>Find your perfect home away from home</p>
          </div>
          <div className="selection-card" onClick={() => navigate('/owner-login')}>
            <div className="card-icon">🏢</div>
            <h3>I'm a PG Owner</h3>
            <p>List your property and find tenants</p>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className={`reviews-section ${showReviews ? 'visible' : ''}`}>
        <h2>What Our Users Say</h2>
        <div className="reviews-container">
          <div className="review-card">
            <div className="review-stars">
              {'⭐'.repeat(reviews[currentReview].rating)}
            </div>
            <p className="review-text">"{reviews[currentReview].text}"</p>
            <div className="review-author">
              <strong>{reviews[currentReview].name}</strong>
              <span>{reviews[currentReview].location}</span>
            </div>
          </div>
          <div className="review-dots">
            {reviews.map((_, idx) => (
              <span 
                key={idx} 
                className={`dot ${idx === currentReview ? 'active' : ''}`}
                onClick={() => setCurrentReview(idx)}
              />
            ))}
          </div>
        </div>
        <div className="trust-badge">
          <span className="badge-icon">✓</span>
          <span>Trusted by 2,000+ customers</span>
        </div>
      </section>

      {/* Spacer for scroll */}
      <div style={{ height: '100vh' }}></div>
    </div>
  );
};

export default Homepage;