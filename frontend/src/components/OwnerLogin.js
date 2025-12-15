import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const OwnerLogin = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    aadhar: '',
    phone: ''
  });
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (showOtp) {
      if (otp === '123456') {
        try {
          const endpoint = isRegister ? '/api/owner/register' : '/api/owner/login';
          const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
          onLogin(res.data.owner, 'owner');
          navigate('/owner-dashboard');
        } catch (error) {
          alert(error.response?.data?.message || 'Error occurred');
        }
      } else {
        alert('Invalid OTP');
      }
    } else {
      setShowOtp(true);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isRegister ? 'Owner Registration' : 'Owner Login'}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={formData.dob}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="aadhar"
                placeholder="Aadhar Number"
                maxLength="12"
                value={formData.aadhar}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            maxLength="10"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          
          {showOtp && (
            <input
              type="text"
              placeholder="Enter OTP (use 123456)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}
          
          <button type="submit" className="btn-primary">
            {showOtp ? 'Verify OTP' : (isRegister ? 'Register' : 'Login')}
          </button>
        </form>
        
        <p className="toggle-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? ' Login' : ' Register'}
          </span>
        </p>
        
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default OwnerLogin;