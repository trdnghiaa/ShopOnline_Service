// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/user')

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const user = new User({ username, password, email });
    await user.save();
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Route POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm user theo username
    const user = await User.findOne({ username });

    // Nếu không tìm thấy user hoặc mật khẩu không khớp, trả về lỗi Unauthorized
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Đăng nhập thành công, trả về mã token hoặc thông báo thành công
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
