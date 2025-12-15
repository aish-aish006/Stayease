import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Property.css';

const AddProperty = ({ user }) => {
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    city: '',
    pincode: '',
    price: '',
    type: 'Single',
    vacantRooms: ''
  });
  const [certificate, setCertificate] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCertificate(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('ownerId', user._id);
    data.append('name', formData.name);
    data.append('area', formData.area);
    data.append('city', formData.city);
    data.append('pincode', formData.pincode);
    data.append('price', formData.price);
    data.append('type', formData.type);
    data.append('vacantRooms', formData.vacantRooms);
    data.append('landCertificate', certificate);

    try {
      await axios.post('http://localhost:5000/api/property/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Property added successfully!');
      navigate('/owner-dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding property');
    }
  };

  return (
    <div className="property-form-container">
      <div className="property-form-box">
        <h2>Add New Property</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Property Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <input
            type="text"
            name="area"
            placeholder="Area/Locality"
            value={formData.area}
            onChange={handleChange}
            required
          />
          
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
          
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            maxLength="6"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
          
          <input
            type="number"
            name="price"
            placeholder="Monthly Rent (₹)"
            value={formData.price}
            onChange={handleChange}
            required
          />
          
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="Single">Single Room</option>
            <option value="2 Sharing">2 Sharing</option>
            <option value="3 Sharing">3 Sharing</option>
          </select>
          
          <input
            type="number"
            name="vacantRooms"
            placeholder="Number of Vacant Rooms"
            value={formData.vacantRooms}
            onChange={handleChange}
            required
          />
          
          <div className="file-input">
            <label>Land Possession Certificate:</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary">Add Property</button>
        </form>
        
        <button className="back-btn" onClick={() => navigate('/owner-dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AddProperty;