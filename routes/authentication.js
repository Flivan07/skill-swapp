const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/users');
const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  const { username, email, password, bio , skills } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await users.create({
      username,
      email,
      password: hashed,
      bio,
      skills,
      isAdmin: email === "flivan12345@gmail.com"
    });
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email, password);

  try {
    const user = await users.findOne({ where: { email } });
    console.log("User found:", user);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    console.log("Password match:", match);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id , isAdmin: user.isAdmin }, "secret123" , { expiresIn: '1d' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});


module.exports = router;