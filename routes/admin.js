const express = require("express");
const { Op } = require("sequelize");
const users = require("../models/users");
const Review = require("../models/review");  
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware: check if user is admin
const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, "secret123");
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Admins only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Get all users
router.get("/users", adminMiddleware, async (req, res) => {
  try {
    const allUsers = await users.findAll({
      attributes: ["id", "username", "email", "isAdmin"]
    });
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Warn a user
router.post("/users/:id/warn", adminMiddleware, async (req, res) => {
  try {
    const user = await users.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    // Here you could send an email, or store a warning in DB.
    // For now, just log:
    console.log(`Admin warned user ${user.username}`);
    res.json({ message: `Warning sent to ${user.username}` });
  } catch (err) {
    res.status(500).json({ error: "Failed to warn user" });
  }
});

// Remove a user
router.delete("/users/:id", adminMiddleware, async (req, res) => {
  try {
    const user = await users.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    await user.destroy();
    res.json({ message: "User removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove user" });
  }
});


module.exports = router;