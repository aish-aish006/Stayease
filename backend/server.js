// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/stayease', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ==================== SCHEMAS ====================

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  aadhar: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', customerSchema);

// Owner Schema
const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  aadhar: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Owner = mongoose.model('Owner', ownerSchema);

// Property Schema
const propertySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  name: { type: String, required: true },
  area: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  landCertificate: { type: String, required: true },
  images: [{ type: String }],
  vacantRooms: { type: Number, default: 0 },
  price: { type: Number, required: true },
  type: { type: String, enum: ['Single', '2 Sharing', '3 Sharing'], required: true },
  rating: { type: Number, default: 0 },
  reviews: [{ 
    customerId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Property = mongoose.model('Property', propertySchema);

// ==================== ROUTES ====================

// Customer Registration
app.post('/api/customer/register', async (req, res) => {
  try {
    const { name, dob, aadhar, phone } = req.body;
    
    const existingCustomer = await Customer.findOne({ $or: [{ aadhar }, { phone }] });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists with this Aadhar or Phone' });
    }

    const customer = new Customer({ name, dob, aadhar, phone, verified: true });
    await customer.save();
    
    res.status(201).json({ message: 'Registration successful', customer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Customer Login
app.post('/api/customer/login', async (req, res) => {
  try {
    const { phone } = req.body;
    
    const customer = await Customer.findOne({ phone });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json({ message: 'Login successful', customer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Owner Registration
app.post('/api/owner/register', async (req, res) => {
  try {
    const { name, dob, aadhar, phone } = req.body;
    
    const existingOwner = await Owner.findOne({ $or: [{ aadhar }, { phone }] });
    if (existingOwner) {
      return res.status(400).json({ message: 'Owner already exists with this Aadhar or Phone' });
    }

    const owner = new Owner({ name, dob, aadhar, phone, verified: true });
    await owner.save();
    
    res.status(201).json({ message: 'Registration successful', owner });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Owner Login
app.post('/api/owner/login', async (req, res) => {
  try {
    const { phone } = req.body;
    
    const owner = await Owner.findOne({ phone });
    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }
    
    res.json({ message: 'Login successful', owner });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add Property
app.post('/api/property/add', upload.single('landCertificate'), async (req, res) => {
  try {
    const { ownerId, name, area, city, pincode, price, type, vacantRooms } = req.body;
    
    const property = new Property({
      ownerId,
      name,
      area,
      city,
      pincode,
      landCertificate: req.file.path,
      price,
      type,
      vacantRooms: vacantRooms || 0
    });
    
    await property.save();
    res.status(201).json({ message: 'Property added successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Owner Properties
app.get('/api/property/owner/:ownerId', async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.params.ownerId });
    res.json({ properties });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Property
app.put('/api/property/update/:id', upload.array('images', 10), async (req, res) => {
  try {
    const { price, type, vacantRooms, area } = req.body;
    const updateData = { price, type, vacantRooms, area };
    
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }
    
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json({ message: 'Property updated successfully', property });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Search Properties
app.get('/api/property/search', async (req, res) => {
  try {
    const { priceMin, priceMax, type, city } = req.query;
    
    let query = { vacantRooms: { $gt: 0 } };
    
    if (priceMin && priceMax) {
      query.price = { $gte: parseInt(priceMin), $lte: parseInt(priceMax) };
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (city) {
      query.city = new RegExp(city, 'i');
    }
    
    const properties = await Property.find(query).populate('ownerId', 'name phone');
    res.json({ properties });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Property Details
app.get('/api/property/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('ownerId', 'name phone');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ property });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});