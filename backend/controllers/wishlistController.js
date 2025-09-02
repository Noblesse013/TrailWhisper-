const Wishlist = require("../models/wishlist.model");

// Add new wishlist item
const addWishlistItem = async (req, res) => {
    const { destination, description, plannedDate, priority, estimatedBudget, notes, imageUrl } = req.body;
    const { userId } = req.user;

    if (!destination) {
        return res.status(400).json({ error: true, message: "Destination is required" });
    }

    try {
        const wishlistItem = new Wishlist({
            destination,
            description,
            plannedDate: plannedDate ? new Date(parseInt(plannedDate)) : null,
            priority: priority || 'Medium',
            estimatedBudget,
            notes,
            imageUrl,
            userId
        });

        await wishlistItem.save();

        return res.status(201).json({
            error: false,
            message: "Wishlist item added successfully",
            wishlistItem
        });

    } catch (error) {
        console.error("❌ Error adding wishlist item:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Get all wishlist items for user
const getWishlistItems = async (req, res) => {
    const { userId } = req.user;

    try {
        const wishlistItems = await Wishlist.find({ userId }).sort({ createdOn: -1 });

        return res.json({
            error: false,
            wishlistItems
        });

    } catch (error) {
        console.error("❌ Error fetching wishlist items:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Update wishlist item
const updateWishlistItem = async (req, res) => {
    const { wishlistId } = req.params;
    const { destination, description, plannedDate, priority, estimatedBudget, notes, imageUrl } = req.body;
    const { userId } = req.user;

    if (!destination) {
        return res.status(400).json({ error: true, message: "Destination is required" });
    }

    try {
        const updatedWishlistItem = await Wishlist.findOneAndUpdate(
            { _id: wishlistId, userId },
            {
                destination,
                description,
                plannedDate: plannedDate ? new Date(parseInt(plannedDate)) : null,
                priority: priority || 'Medium',
                estimatedBudget,
                notes,
                imageUrl,
                updatedOn: new Date()
            },
            { new: true }
        );

        if (!updatedWishlistItem) {
            return res.status(404).json({ error: true, message: "Wishlist item not found" });
        }

        return res.json({
            error: false,
            message: "Wishlist item updated successfully",
            wishlistItem: updatedWishlistItem
        });

    } catch (error) {
        console.error("❌ Error updating wishlist item:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Delete wishlist item
const deleteWishlistItem = async (req, res) => {
    const { wishlistId } = req.params;
    const { userId } = req.user;

    try {
        const deletedWishlistItem = await Wishlist.findOneAndDelete({ _id: wishlistId, userId });

        if (!deletedWishlistItem) {
            return res.status(404).json({ error: true, message: "Wishlist item not found" });
        }

        return res.json({
            error: false,
            message: "Wishlist item deleted successfully"
        });

    } catch (error) {
        console.error("❌ Error deleting wishlist item:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
};

// Get wishlist statistics
const getWishlistStats = async (req, res) => {
    const { userId } = req.user;

    try {
        const totalItems = await Wishlist.countDocuments({ userId });
        const priorityStats = await Wishlist.aggregate([
            { $match: { userId: require("mongoose").Types.ObjectId(userId) } },
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ]);

        const avgBudget = await Wishlist.aggregate([
            { 
                $match: { 
                    userId: require("mongoose").Types.ObjectId(userId),
                    estimatedBudget: { $exists: true, $ne: null }
                } 
            },
            { $group: { _id: null, avgBudget: { $avg: "$estimatedBudget" } } }
        ]);

        return res.json({
            error: false,
            stats: {
                totalItems,
                priorityBreakdown: priorityStats,
                averageBudget: avgBudget.length > 0 ? avgBudget[0].avgBudget : 0
            }
        });

    } catch (error) {
        console.error("❌ Error fetching wishlist stats:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
};

module.exports = {
    addWishlistItem,
    getWishlistItems,
    updateWishlistItem,
    deleteWishlistItem,
    getWishlistStats
};
