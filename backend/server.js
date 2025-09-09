require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");

// Validate required environment variables
const requiredEnvVars = [
  'connectionString',
  'ACCESS_TOKEN_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  // Don't exit in serverless environment, just log the error
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
}

// MongoDB connection with proper error handling
const connectDB = async () => {
  try {
    if (!process.env.connectionString) {
      console.error("❌ MongoDB connection string not found");
      return;
    }
    
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log("✅ Already connected to MongoDB");
      return;
    }
    
    await mongoose.connect(process.env.connectionString);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Don't exit in serverless environment
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Connect to MongoDB
connectDB();

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📤 Mongoose disconnected');
});

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));  // Increase JSON body size limit
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS configuration with fallback
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://trail-whisper-delta.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Serve static files from assets directory
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Test endpoint to verify CORS
app.get("/test", (req, res) => {
    res.json({ message: "CORS is working!", timestamp: new Date().toISOString() });
});

// Import Routes
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const travelStoryRoutes = require("./routes/travelStoryRoutes");
const imageRoutes = require("./routes/imageRoutes");
const chatbotRoutes = require('./routes/chatbotRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

// Use Routes
app.use("/", userRoutes);           // User authentication routes
app.use("/", adminRoutes);          // Admin management routes
app.use("/", travelStoryRoutes);    // Travel story CRUD routes
app.use("/", imageRoutes);          // Image upload/delete routes
app.use('/api/chatbot', chatbotRoutes); // Chatbot interaction routes
app.use("/", wishlistRoutes);       // Wishlist management routes
app.use("/", favoriteRoutes);       // Favorite management routes

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server (only if not in serverless environment and not being required as module)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL && require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

// Export for serverless environments
module.exports = app;
