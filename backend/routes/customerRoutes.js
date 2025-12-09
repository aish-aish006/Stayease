const express = require("express");
const router = express.Router();

// TEMP: dummy login (accept anything)
router.post("/login", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    console.log("Login attempt:", phone, otp);

    // later: check DB here
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    // fake success for now
    return res.json({ message: "Login success", token: "dummy-token" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// TEMP: dummy register
router.post("/register", async (req, res) => {
  try {
    const { phone } = req.body;
    console.log("Register attempt:", phone);

    if (!phone) {
      return res.status(400).json({ message: "Phone required" });
    }

    // fake success
    return res.status(201).json({ message: "Customer registered" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
