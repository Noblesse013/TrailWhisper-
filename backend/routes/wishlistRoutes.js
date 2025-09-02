const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../utilities");
const {
    addWishlistItem,
    getWishlistItems,
    updateWishlistItem,
    deleteWishlistItem,
    getWishlistStats
} = require("../controllers/wishlistController");

// All routes require authentication
router.post("/add-wishlist-item", authenticateToken, addWishlistItem);
router.get("/get-wishlist-items", authenticateToken, getWishlistItems);
router.put("/update-wishlist-item/:wishlistId", authenticateToken, updateWishlistItem);
router.delete("/delete-wishlist-item/:wishlistId", authenticateToken, deleteWishlistItem);
router.get("/get-wishlist-stats", authenticateToken, getWishlistStats);

module.exports = router;
