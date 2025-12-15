import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const API_BASE = "http://localhost:5000";

const CustomerLogin = ({ onLogin }) => {
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

  const handleSubmit = async () => {
    console.log("HandleSubmit called. showOtp =", showOtp);

    if (!showOtp) {
      // First click → just show OTP field
      setShowOtp(true);
      return;
    }

    // Second click → user is trying to verify OTP
    if (otp !== '123456') {
      alert('Invalid OTP');
      return;
    }

    try {
      const endpoint = isRegister
        ? `${API_BASE}/api/customer/register`
        : `${API_BASE}/api/customer/login`;

      console.log("Calling endpoint:", endpoint);

      // For login, you only really need phone (and maybe otp)
      const payload = isRegister
        ? { ...formData }          // send all fields on register
        : { phone: formData.phone, otp }; // send minimal on login

      const res = await axios.post(endpoint, payload);

      console.log("Response from backend:", res.data);

   if (onLogin) {
  // use the phone (and later more fields) as the logged-in user
  const loggedInUser = isRegister
    ? { ...formData }
    : { phone: formData.phone };

  onLogin(loggedInUser, 'customer');
}

      navigate('/customer-dashboard');
    } catch (error) {
      console.error("Error during login/register:", error);
      alert(error.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isRegister ? 'Customer Registration' : 'Customer Login'}</h2>

        {/* Prevent default form submission completely */}
        <form onSubmit={(e) => e.preventDefault()}>
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

          {/* Use button type="button" so the form NEVER auto-submits */}
          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit}
          >
            {showOtp ? 'Verify OTP' : (isRegister ? 'Register' : 'Login')}
          </button>
        </form>

        <p className="toggle-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => {
            setIsRegister(!isRegister);
            setShowOtp(false);
            setOtp('');
          }}>
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

export default CustomerLogin;
