const express = require("express");
const Review = require("../models/review");
const { authMiddleware } = require("./user");
const router = express.Router();

// Create review
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { receiverId, rating, comment } = req.body;
    const review = await Review.create({
      senderId: req.user.id,
      receiverId,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// Get reviews of a specific user
router.get("/:userId", async (req, res) => {
  try {
    const review = await Review.findAll({
      where: { receiverId: req.params.userId }
    });
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Get reviews of all users
router.get("/all", async (req, res) => {
  try {
    const review = await Review.findAll();
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

module.exports = router;