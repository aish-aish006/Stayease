import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const CustomerDashboard = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('profile');
  const [searchParams, setSearchParams] = useState({
    priceMin: '4000',
    priceMax: '10000',
    type: 'all',
    city: ''
  });
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="logo-sidebar">
          <h3>StayEase</h3>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={activeMenu === 'profile' ? 'active' : ''}
            onClick={() => setActiveMenu('profile')}
          >
            👤 Profile
          </button>
          <button 
            className={activeMenu === 'search' ? 'active' : ''}
            onClick={() => setActiveMenu('search')}
          >
            🔍 Search PGs
          </button>
          <button 
            className={activeMenu === 'safety' ? 'active' : ''}
            onClick={() => setActiveMenu('safety')}
          >
            🛡️ Safety Guarantee
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
                <label>Verified:</label>
                <span className="verified">✓ Verified</span>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'search' && (
          <div className="content-section">
            <h2>Search for PGs</h2>
            <div className="search-filters">
              <div className="filter-group">
                <label>Price Range</label>
                <select 
                  value={`${searchParams.priceMin}-${searchParams.priceMax}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-');
                    setSearchParams({...searchParams, priceMin: min, priceMax: max});
                  }}
                >
                  <option value="4000-10000">₹4,000 - ₹10,000</option>
                  <option value="10000-15000">₹10,000 - ₹15,000</option>
                  <option value="15000-20000">₹15,000 - ₹20,000</option>
                  <option value="20000-50000">₹20,000+</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Accommodation Type</label>
                <select 
                  value={searchParams.type}
                  onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
                >
                  <option value="all">All Types</option>
                  <option value="Single">Single Room</option>
                  <option value="2 Sharing">2 Sharing</option>
                  <option value="3 Sharing">3 Sharing</option>
                </select>
              </div>

              <div className="filter-group">
                <label>City</label>
                <input 
                  type="text"
                  placeholder="Enter city name"
                  value={searchParams.city}
                  onChange={(e) => setSearchParams({...searchParams, city: e.target.value})}
                />
              </div>

              <button className="btn-primary" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        )}

        {activeMenu === 'safety' && (
          <div className="content-section">
            <h2>Safety Guarantee</h2>
            <div className="safety-card">
              <h3>🛡️ Trusted by 2,000+ Customers</h3>
              <ul>
                <li>✓ All properties verified with land certificates</li>
                <li>✓ Aadhar verification for owners and customers</li>
                <li>✓ 24/7 customer support</li>
                <li>✓ Genuine reviews from verified tenants</li>
              </ul>
            </div>
          </div>
        )}

        {activeMenu === 'contact' && (
          <div className="content-section">
            <h2>Contact Us</h2>
            <div className="contact-card">
              <div className="contact-item">
                <span className="icon">📞</span>
                <span>Phone: 11222233344</span>
              </div>
              <div className="contact-item">
                <span className="icon">✉️</span>
                <span>Email: 11122233@gmail.com</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;