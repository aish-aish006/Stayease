import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';

const API_BASE = "http://localhost:5000";

const SearchResults = () => {
  const [properties, setProperties] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    try {
      // For now we ignore filters on backend and just get all dummy properties
      const res = await axios.get(`${API_BASE}/api/properties`);
      console.log("Dummy properties from backend:", res.data);
      setProperties(res.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  return (
    <div className="search-results-container">
      <div className="search-header">
        <h2>Search Results</h2>
        <button className="back-btn" onClick={() => navigate('/customer-dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="no-results">
          <p>No properties found matching your criteria.</p>
        </div>
      ) : (
        <div className="results-grid">
          {properties.map((property) => (
            <div key={property._id} className="result-card">
              <div className="card-image">
                {property.imageUrl ? (
                  <img src={property.imageUrl} alt={property.title} />
                ) : (
                  <div className="placeholder-image">🏠</div>
                )}
              </div>
              <div className="card-content">
                <h3>{property.title}</h3>
                <p className="location">
                  📍 {property.area}, {property.city}
                </p>
                <p className="price">
                  💰 ₹{property.rent}/month
                </p>
                <p className="type">
                  🛏️ {property.type} • {property.occupancyType}
                </p>
                <p className="rooms">
                  🚪 {property.availableBeds} beds available
                </p>
                <p className="rating">
                  ⭐ 4.3/5 (demo)
                </p>
                <p className="amenities">
                  <b>Amenities:</b> {property.amenities.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
