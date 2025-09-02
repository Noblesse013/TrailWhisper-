const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../utilities");
const {
    createAccount,
    login,
    getUser,
    updateProfileImage,
    getUserCount
} = require("../controllers/userController");


router.post("/create-account", createAccount);
router.post("/login", login);

router.get("/api/users/count", getUserCount);


router.get("/get-user", authenticateToken, getUser);
router.put("/update-profile-image", authenticateToken, updateProfileImage);

module.exports = router;
