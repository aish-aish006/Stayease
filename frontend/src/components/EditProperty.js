import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Property.css';

const EditProperty = ({ user }) => {
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    price: '',
    type: 'Single',
    vacantRooms: '',
    area: ''
  });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/property/${id}`);
      const prop = res.data.property;
      setProperty(prop);
      setFormData({
        price: prop.price,
        type: prop.type,
        vacantRooms: prop.vacantRooms,
        area: prop.area
      });
    } catch (error) {
      console.error('Error fetching property:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('price', formData.price);
    data.append('type', formData.type);
    data.append('vacantRooms', formData.vacantRooms);
    data.append('area', formData.area);
    
    for (let i = 0; i < images.length; i++) {
      data.append('images', images[i]);
    }

    try {
      await axios.put(`http://localhost:5000/api/property/update/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Property updated successfully!');
      navigate('/owner-dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating property');
    }
  };

  if (!property) return <div>Loading...</div>;

  return (
    <div className="property-form-container">
      <div className="property-form-box">
        <h2>Edit Property: {property.name}</h2>
        <form onSubmit={handleSubmit}>
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
          
          <input
            type="text"
            name="area"
            placeholder="Area/Locality"
            value={formData.area}
            onChange={handleChange}
            required
          />
          
          <div className="file-input">
            <label>Upload PG Images:</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              multiple
              onChange={handleFileChange}
            />
          </div>
          
          {property.images && property.images.length > 0 && (
            <div className="current-images">
              <p>Current Images: {property.images.length}</p>
            </div>
          )}
          
          <button type="submit" className="btn-primary">Update Property</button>
        </form>
        
        <button className="back-btn" onClick={() => navigate('/owner-dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default EditProperty;