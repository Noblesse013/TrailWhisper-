const Favorite = require("../models/favorite.model");
const TravelStory = require("../models/travelStory.model");


const addToFavorites = async (req, res) => {
    const { itemType, itemId, notes, tags } = req.body;
    const { userId } = req.user;

    if (!itemType || !itemId) {
        return res.status(400).json({ error: true, message: "Item type and ID are required" });
    }

    if (!['TravelStory', 'Destination'].includes(itemType)) {
        return res.status(400).json({ error: true, message: "Invalid item type" });
    }

    try {
        
        const existingFavorite = await Favorite.findOne({ userId, itemType, itemId });
        if (existingFavorite) {
            return res.status(409).json({ error: true, message: "Item already in favorites" });
        }

        const favorite = new Favorite({
            itemType,
            itemId,
            userId,
            notes,
            tags: tags || []
        });

        await favorite.save();

        
        if (itemType === 'TravelStory') {
            await TravelStory.findByIdAndUpdate(itemId, { isFavourite: true });
        }

        return res.status(201).json({
            error: false,
            message: "Item added to favorites successfully",
            favorite
        });

    } catch (error) {
        console.error("❌ Error adding to favorites:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
};


const removeFromFavorites = async (req, res) => {
    const { itemType, itemId } = req.body;
    const { userId } = req.user;

    try {
        const deletedFavorite = await Favorite.findOneAndDelete({ userId, itemType, itemId });

        if (!deletedFavorite) {
            return res.status(404).json({ error: true, message: "Favorite not found" });
        }

        
        if (itemType === 'TravelStory') {
            await TravelStory.findByIdAndUpdate(itemId, { isFavourite: false });
        }

        return res.json({
            error: false,
            message: "Item removed from favorites successfully"
        });

    } catch (error) {
        console.error("❌ Error removing from favorites:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
};


const getFavorites = async (req, res) => {
    const { userId } = req.user;
    const { itemType } = req.query;

    try {
        let query = { userId };
        if (itemType) {
            query.itemType = itemType;
        }

        const favorites = await Favorite.find(query).sort({ createdOn: -1 });

        
        const populatedFavorites = await Promise.all(
            favorites.map(async (favorite) => {
                let item = null;
                
                if (favorite.itemType === 'TravelStory') {
                    item = await TravelStory.findById(favorite.itemId);
                }
                

                return {
                    ...favorite.toObject(),
                    item
                };
            })
        );

        return res.json({
            error: false,
            favorites: populatedFavorites
        });

    } catch (error) {
        console.error(" Error fetching favorites:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
};


const toggleFavorite = async (req, res) => {
    const { itemType, itemId } = req.body;
    const { userId } = req.user;

    try {
        const existingFavorite = await Favorite.findOne({ userId, itemType, itemId });

        if (existingFavorite) {
            
            await Favorite.findByIdAndDelete(existingFavorite._id);
            
            if (itemType === 'TravelStory') {
                await TravelStory.findByIdAndUpdate(itemId, { isFavourite: false });
            }

            return res.json({
                error: false,
                message: "Item removed from favorites",
                isFavorite: false
            });
        } else {
            
            const favorite = new Favorite({
                itemType,
                itemId,
                userId
            });

            await favorite.save();

            if (itemType === 'TravelStory') {
                await TravelStory.findByIdAndUpdate(itemId, { isFavourite: true });
            }

            return res.json({
                error: false,
                message: "Item added to favorites",
                isFavorite: true
            });
        }

    } catch (error) {
        console.error(" Error toggling favorite:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
};


const getFavoriteStats = async (req, res) => {
    const { userId } = req.user;

    try {
        const totalFavorites = await Favorite.countDocuments({ userId });
        const typeBreakdown = await Favorite.aggregate([
            { $match: { userId: require("mongoose").Types.ObjectId(userId) } },
            { $group: { _id: "$itemType", count: { $sum: 1 } } }
        ]);

        return res.json({
            error: false,
            stats: {
                totalFavorites,
                typeBreakdown
            }
        });

    } catch (error) {
        console.error(" Error fetching favorite stats:", error);
        return res.status(500).json({ error: true, message: error.message });
    }
};

module.exports = {
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    toggleFavorite,
    getFavoriteStats
};
