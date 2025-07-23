require("dotenv").config();
const mongoose = require("mongoose");

console.log("🔍 Testing MongoDB connection...");
console.log("Connection string:", process.env.connectionString ? "✅ Loaded" : "❌ Missing");

if (!process.env.connectionString) {
    console.error("❌ CONNECTION_STRING not found in environment variables");
    process.exit(1);
}

mongoose.connect(process.env.connectionString)
    .then(() => {
        console.log("✅ MongoDB connection successful!");
        console.log("📦 Database name:", mongoose.connection.db.databaseName);
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:");
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        process.exit(1);
    });

// Timeout after 10 seconds
setTimeout(() => {
    console.error("⏰ Connection test timed out after 10 seconds");
    process.exit(1);
}, 10000);
