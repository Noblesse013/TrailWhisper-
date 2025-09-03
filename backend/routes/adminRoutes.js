const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../utilities");
const {
    getAllUsers,
    getUserStats,
    deleteUser
} = require("../controllers/adminController");


router.get("/get-all-users", authenticateToken, getAllUsers);
router.get("/get-user-stats", authenticateToken, getUserStats);
router.delete("/delete-user/:userId", authenticateToken, deleteUser);

module.exports = router;
