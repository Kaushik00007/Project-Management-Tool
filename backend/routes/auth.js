import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });
};

router.post('/signup', async (req, res) => {
  console.log("Signup Request:", JSON.stringify(req.body));

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
    
    await user.save();
    console.log("New user saved:", user);

    res.status(201).json({
      message: "Signup successful",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

router.post('/login', async (req, res) => {
  console.log("Login Request:", JSON.stringify(req.body));

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("User found:", user.email);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Fetch Profile Error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updatedFields = {};

    if (name) updatedFields.name = name.trim();
    
    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(409).json({ error: "Email is already in use" });
      }
      updatedFields.email = normalizedEmail;
    }

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
      }
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.user.id, updatedFields, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

export default router;
