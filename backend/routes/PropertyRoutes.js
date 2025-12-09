const express = require("express");
const router = express.Router();
const dummyProperties = require("../data/dummyProperties");

router.get("/", (req, res) => {
  res.json(dummyProperties);
});

router.get("/:id", (req, res) => {
  const property = dummyProperties.find((p) => p._id === req.params.id);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }
  res.json(property);
});

module.exports = router;
