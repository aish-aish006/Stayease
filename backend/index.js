const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Debug logger - see every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Property routes (dummy data)
const propertyRoutes = require("./routes/PropertyRoutes");
app.use("/api/properties", propertyRoutes);

// ----- AUTH ROUTES YOUR FRONTEND IS CALLING -----

// POST /api/customer/login
app.post("/api/customer/login", (req, res) => {
  console.log("Hit /api/customer/login with body:", req.body);
  return res.json({ message: "Login OK (dummy)", token: "dummy-token" });
});

// POST /api/customer/register
app.post("/api/customer/register", (req, res) => {
  console.log("Hit /api/customer/register with body:", req.body);
  return res.status(201).json({ message: "Register OK (dummy)" });
});

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running on port 5000");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
