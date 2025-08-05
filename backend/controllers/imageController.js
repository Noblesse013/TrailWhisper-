const cloudinary = require("../cloudinary");

// Upload Image
const uploadImage = async (req, res) => {
    try {
        const { image } = req.body; 
        if (!image) {
            return res.status(400).json({ error: true, message: "No image provided" });
        }

        console.log("Cloudinary Uploader:", cloudinary.uploader);

        const result = await cloudinary.uploader.upload(image, {
            folder: "travel_stories",
        });

        res.status(200).json({ imageUrl: result.secure_url, publicId: result.public_id });
    } catch (error) {
        console.error("❌ Error uploading image:", error);
        res.status(500).json({ error: true, message: error.message });
    }
};

// Delete Image
const deleteImage = async (req, res) => {
    const { publicId } = req.body;

    if (!publicId) {
        return res.status(400).json({ error: true, message: "Public ID is required" });
    }

    try {
        await cloudinary.uploader.destroy(publicId);
        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

module.exports = {
    uploadImage,
    deleteImage
};
