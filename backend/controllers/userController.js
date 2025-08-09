const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const cloudinary = require("../cloudinary");

// Create Account
const createAccount = async (req, res) => {
    const { fullName, email, password, profileImage } = req.body;

    if (!fullName || !email || !password) {
        return res
            .status(400)
            .json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res
            .status(400)
            .json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUrl = "";
    if (profileImage) {
        try {
            const uploadResponse = await cloudinary.uploader.upload(profileImage, {
                folder: "profile_images",
            });
            imageUrl = uploadResponse.secure_url;
        } catch (uploadError) {
            return res.status(500).json({
                error: true,
                message: "Error uploading profile image"
            });
        }
    }

    const user = new User({
        fullName,
        email,
        password: hashedPassword,
        profileImage: imageUrl,
    });

    await user.save();

    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.status(201).json({
        error: false,
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage
        },
        accessToken,
        message: "Registration Successful",
    });
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required!" });
    }

    // Check for hardcoded admin credentials
    if (email === 'trailwhisper_admin' && password === 'trailwhisper1234') {
        const accessToken = jwt.sign(
            { userId: 'admin', isAdmin: true },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "72h",
            }
        );

        return res.json({
            error: false,
            message: "Admin Login Successful",
            user: {
                _id: 'admin',
                fullName: 'TrailWhisper Admin',
                email: 'trailwhisper_admin',
                profileImage: null
            },
            accessToken,
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.json({
        error: false,
        message: "Login Successful",
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImage: user.profileImage
        },
        accessToken,
    });
};

// Get User
const getUser = async (req, res) => {
    const { userId, isAdmin } = req.user;

    // Handle hardcoded admin user
    if (isAdmin && userId === 'admin') {
        return res.json({
            user: {
                _id: 'admin',
                fullName: 'TrailWhisper Admin',
                email: 'trailwhisper_admin',
                profileImage: null
            },
            message: "",
        });
    }

    const isUser = await User.findOne({ _id: userId });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            _id: isUser._id,
            fullName: isUser.fullName,
            email: isUser.email,
            profileImage: isUser.profileImage
        },
        message: "",
    });
};

// Update Profile Image
const updateProfileImage = async (req, res) => {
    const { userId } = req.user;
    const { profileImage } = req.body;

    try {
        let imageUrl = '';

        // If profileImage is provided and not empty, upload to Cloudinary
        if (profileImage && profileImage.trim() !== '') {
            const result = await cloudinary.uploader.upload(profileImage, {
                folder: "profile_images",
                transformation: [
                    { width: 200, height: 200, crop: "fill" }
                ]
            });
            imageUrl = result.secure_url;
        }

        // Update user with new profile image URL
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profileImage: imageUrl },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        return res.json({
            user: {
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                profileImage: updatedUser.profileImage
            },
            message: "Profile image updated successfully"
        });

    } catch (error) {
        console.error("❌ Error updating profile image:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
};

module.exports = {
    createAccount,
    login,
    getUser,
    updateProfileImage
};
