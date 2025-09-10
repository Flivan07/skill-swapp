const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const { Op } = require("sequelize");

// Middleware to check auth
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Send a message
router.post("/send", authMiddleware, async (req, res) => {
  const { receiverId, content } = req.body;
  try {
    const chat = await Message.create({
      senderId: req.user.id,
      receiverId,
      content,
    });
    res.json({ message: "Message sent", data: chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Unread messages count
router.get("/unread", authMiddleware, async (req, res) => {
  try {
    const chat = await Message.findAll({
      where: {
        receiverId: req.user.id,
        isRead: false  // you need an isRead column in your Message model
      }
    });
    res.json({ count: chat.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch unread messages" });
  }
});

// message received
router.get("/:receiverId", authMiddleware, async (req, res) => {
  const { receiverId } = req.params;
  const userId = req.user.id;

  try {
    const chat = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      },
      order: [["createdAt", "ASC"]],
    });
    res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});


module.exports = router;