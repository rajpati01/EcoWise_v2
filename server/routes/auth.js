import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin Register
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

router.post('/admin/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: 'admin', // 🔥 Explicitly set role
    });

    await adminUser.save();
    res.status(201).json({ message: 'Admin registered successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Error registering admin', error: err.message });
  }
});

export default router;