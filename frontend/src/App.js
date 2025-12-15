// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './components/Homepage';
import CustomerLogin from './components/CustomerLogin';
import OwnerLogin from './components/OwnerLogin';
import CustomerDashboard from './components/CustomerDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import SearchResults from './components/SearchResults';
import AddProperty from './components/AddProperty';
import EditProperty from './components/EditProperty';

function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

 useEffect(() => {
  try {
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');

    // only try to parse if it's not null/undefined/"undefined"
    if (storedUser && storedUser !== 'undefined') {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setUserType(storedUserType);
    } else {
      // clean up any bad values
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
    }
  } catch (e) {
    console.error('Failed to parse stored user from localStorage:', e);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  }
}, []);


  const handleLogin = (userData, type) => {
    setUser(userData);
    setUserType(type);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', type);
  };

  const handleLogout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route 
          path="/customer-login" 
          element={<CustomerLogin onLogin={handleLogin} />} 
        />
        <Route 
          path="/owner-login" 
          element={<OwnerLogin onLogin={handleLogin} />} 
        />
        <Route 
          path="/customer-dashboard" 
          element={
            user && userType === 'customer' ? 
            <CustomerDashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/customer-login" />
          } 
        />
        <Route 
          path="/owner-dashboard" 
          element={
            user && userType === 'owner' ? 
            <OwnerDashboard user={user} onLogout={handleLogout} /> : 
            <Navigate to="/owner-login" />
          } 
        />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/add-property" element={<AddProperty user={user} />} />
        <Route path="/edit-property/:id" element={<EditProperty user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;