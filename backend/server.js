require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const path = require("path");

// MongoDB connection with proper error handling
mongoose.connect(process.env.connectionString)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  });

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
app.use(cors()); // Allow all origins for development

// Serve static files from assets directory
app.use("/assets", express.static(path.join(__dirname, "uploads")));

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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
