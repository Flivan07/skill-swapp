const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../models/users.js');
const router = express.Router();
const { Op } = require("sequelize");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, "secret123");
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get("/all", authMiddleware, async (req, res) => {
  try {
    const user = await users.findAll({
      attributes: ["id", "username" , "email"], // only return what’s needed
      where: {
        id: { [require("sequelize").Op.ne]: req.user.id } // exclude current user
      }
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  const user = await users.findByPk(req.user.id);
  res.json(user);
});

router.put('/profile', authMiddleware, async (req, res) => {
  const { username , bio , skills} = req.body;
  const user = await users.findByPk(req.user.id);
  user.username = username
  user.bio = bio
  user.skills = skills
  
  await user.save();
  res.json(user);
});

module.exports = {router , authMiddleware} ;