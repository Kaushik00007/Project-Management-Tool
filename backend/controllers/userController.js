import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ error: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ name, email: normalizedEmail, password: hashedPassword });
    await user.save();

    res.status(201).json({
      message: "Signup successful",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

export const loginUser = async (req, res) => {
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.body.email && req.body.email !== user.email) {
      const existingEmail = await User.findOne({ email: req.body.email.trim().toLowerCase() });
      if (existingEmail) {
        return res.status(409).json({ error: "Email is already in use" });
      }
      user.email = req.body.email.trim().toLowerCase();
    }

    user.name = req.body.name || user.name;

    if (req.body.password) {
      if (req.body.password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
      }
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated successfully",
      user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email },
    });

  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};
