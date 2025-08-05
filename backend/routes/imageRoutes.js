const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../utilities");
const {
    uploadImage,
    deleteImage
} = require("../controllers/imageController");

router.post("/image-upload", authenticateToken, uploadImage);
router.delete("/delete-image", authenticateToken, deleteImage);

module.exports = router;
