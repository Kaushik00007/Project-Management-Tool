import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(" MongoDB URI is missing in the .env file");
  process.exit(1);
}

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(' MongoDB Connected Successfully');
  } catch (err) {
    console.error(' MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send(' Welcome to the Project Management Tool API');
});

app.use((req, res) => {
  res.status(404).json({ message: " Route not found" });
});

app.use((err, req, res, next) => {
  console.error(" Server Error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

process.on('uncaughtException', (err) => {
  console.error(' Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(' Unhandled Promise Rejection:', reason);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(" Server startup error:", err.message);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  console.log(" Server shutting down...");
  await mongoose.connection.close();
  console.log(" MongoDB connection closed");
  process.exit(0);
});

startServer();
