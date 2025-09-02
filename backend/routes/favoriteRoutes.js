const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../utilities");
const {
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    toggleFavorite,
    getFavoriteStats
} = require("../controllers/favoriteController");


router.post("/add-to-favorites", authenticateToken, addToFavorites);
router.delete("/remove-from-favorites", authenticateToken, removeFromFavorites);
router.get("/get-favorites", authenticateToken, getFavorites);
router.post("/toggle-favorite", authenticateToken, toggleFavorite);
router.get("/get-favorite-stats", authenticateToken, getFavoriteStats);

module.exports = router;
