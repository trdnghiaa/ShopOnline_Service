// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Đăng ký người dùng mới
router.post('/register', async (req, res) => {
  const { username, password, email, phone } = req.body;

  try {
    const user = new User({ username, password, email, phone });
    await user.save();
    res.status(201).send({ message: 'Register successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Đăng nhập người dùng
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Cannot find username' });
    }
    if (!await user.comparePassword(password)) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cập nhật thông tin người dùng
router.put('/update', async (req, res) => {
  const { userId, username, password, email, phone } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Profile updated successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;