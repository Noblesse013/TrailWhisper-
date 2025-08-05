const User = require("../models/user.model");
const TravelStory = require("../models/travelStory.model");

// Get All Users (Admin only)
const getAllUsers = async (req, res) => {
    const { userId, isAdmin } = req.user;

    try {
        // Check if the user is the hardcoded admin
        if (!isAdmin || userId !== 'admin') {
            return res.status(403).json({ error: true, message: "Access denied. Admin privileges required." });
        }

        // Get all users
        const allUsers = await User.find({}).select('-password').sort({ createnOn: -1 });

        return res.json({
            users: allUsers.map(user => ({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImage: user.profileImage,
                createnOn: user.createnOn
            }))
        });

    } catch (error) {
        console.error("❌ Error fetching all users:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Delete User (Admin only)
const deleteUser = async (req, res) => {
    const { userId: adminUserId, isAdmin } = req.user;
    const { userId } = req.params;

    try {
        // Check if the user is the hardcoded admin
        if (!isAdmin || adminUserId !== 'admin') {
            return res.status(403).json({ error: true, message: "Access denied. Admin privileges required." });
        }

        // Prevent admin from deleting admin account
        if (userId === 'admin') {
            return res.status(400).json({ error: true, message: "Cannot delete admin account." });
        }

        // Check if user exists
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({ error: true, message: "User not found." });
        }

        // Delete all travel stories by this user first
        await TravelStory.deleteMany({ userId: userId });

        // Delete the user
        await User.findByIdAndDelete(userId);

        return res.json({ message: "User and all associated data deleted successfully." });

    } catch (error) {
        console.error("❌ Error deleting user:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
};

module.exports = {
    getAllUsers,
    deleteUser
};
