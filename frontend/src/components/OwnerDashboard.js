import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const OwnerDashboard = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('profile');
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeMenu === 'properties') {
      fetchProperties();
    }
  }, [activeMenu]);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/property/owner/${user._id}`);
      setProperties(res.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="logo-sidebar">
          <h3>StayEase Owner</h3>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={activeMenu === 'profile' ? 'active' : ''}
            onClick={() => setActiveMenu('profile')}
          >
            👤 Profile
          </button>
          <button 
            className={activeMenu === 'properties' ? 'active' : ''}
            onClick={() => setActiveMenu('properties')}
          >
            🏠 My Properties
          </button>
          <button 
            className="add-property-btn"
            onClick={() => navigate('/add-property')}
          >
            ➕ Add Property
          </button>
          <button 
            className={activeMenu === 'contact' ? 'active' : ''}
            onClick={() => setActiveMenu('contact')}
          >
            📞 Contact Us
          </button>
          <button onClick={onLogout} className="logout-btn">
            🚪 Logout
          </button>
        </nav>
      </div>

      <div className="main-content">
        {activeMenu === 'profile' && (
          <div className="content-section">
            <h2>My Profile</h2>
            <div className="profile-card">
              <div className="profile-field">
                <label>Name:</label>
                <span>{user.name}</span>
              </div>
              <div className="profile-field">
                <label>Phone:</label>
                <span>{user.phone}</span>
              </div>
              <div className="profile-field">
                <label>Aadhar:</label>
                <span>{user.aadhar}</span>
              </div>
              <div className="profile-field">
                <label>Properties Owned:</label>
                <span>{properties.length}</span>
              </div>
              <div className="profile-field">
                <label>Verified:</label>
                <span className="verified">✓ Verified</span>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'properties' && (
          <div className="content-section">
            <h2>My Properties</h2>
            {properties.length === 0 ? (
              <div className="empty-state">
                <p>No properties added yet.</p>
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/add-property')}
                >
                  Add Your First Property
                </button>
              </div>
            ) : (
              <div className="properties-grid">
                {properties.map((property) => (
                  <div 
                    key={property._id} 
                    className="property-card"
                    onClick={() => navigate(`/edit-property/${property._id}`)}
                  >
                    <h3>{property.name}</h3>
                    <p>📍 {property.area}, {property.city}</p>
                    <p>💰 ₹{property.price}/month</p>
                    <p>🛏️ {property.type}</p>
                    <p>🚪 {property.vacantRooms} vacant rooms</p>
                    <p>⭐ {property.rating}/5</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeMenu === 'contact' && (
          <div className="content-section">
            <h2>Contact Us</h2>
            <div className="contact-card">
              <div className="contact-item">
                <span className="icon">📞</span>
                <span>Phone: 1111112222</span>
              </div>
              <div className="contact-item">
                <span className="icon">✉️</span>
                <span>Email: 111222333@gmail.com</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;