const TravelStory = require("../models/travelStory.model");
const cloudinary = require("../cloudinary");

// Add Travel Story
const addTravelStory = async (req, res) => {
    const { title, story, visitedLocation, imageUrl, images, visitedDate } = req.body;
    const { userId } = req.user;
    console.log("📩 Received Story Data:", { title, story, visitedLocation, imageUrl, images, visitedDate, userId });

    // Validate required fields
    if (!title || !story || !visitedLocation || !visitedDate) {
        console.log("❌ Validation failed - missing required fields");
        return res.status(400).json({ error: true, message: "Title, story, visited location, and visited date are required" });
    }

    // Convert visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));
    console.log("📅 Parsed visit date:", parsedVisitedDate);

    try {
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl: imageUrl || undefined,
            images: images || [],
            visitedDate: parsedVisitedDate,
        });

        await travelStory.save();
        console.log("✅ Travel story saved successfully:", travelStory._id);
        res.status(201).json({ error: false, story: travelStory, message: 'Added Successfully' });
    } catch (error) {
        console.error("❌ Error saving travel story:", error.message);
        res.status(400).json({ error: true, message: error.message });
    }
};

// Get All Travel Stories
const getAllStories = async (req, res) => {
    const { userId } = req.user;

    try {
        const travelStories = await TravelStory.find({ userId: userId }).sort({
            isFavourite: -1
        });
        res.status(200).json({ stories: travelStories });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

// Edit Travel Story
const editStory = async (req, res) => {
    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, images, visitedDate } = req.body;
    const { userId } = req.user;

    // Validate required fields
    if (!title || !story || !visitedLocation || !visitedDate) {
        return res
            .status(400)
            .json({ error: true, message: "All fields are required" });
    }

    // Convert visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        // Find the travel story by ID and ensure it belongs to the authenticated user
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }

        const placeholderImgUrl = '/assets/placeholder.png';

        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl || placeholderImgUrl;
        travelStory.images = images || []; 
        travelStory.visitedDate = parsedVisitedDate;

        await travelStory.save();
        res.status(200).json({ story: travelStory, message: 'Update Successful' });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

// Delete Travel Story
const deleteStory = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        // Find travel story by ID and ensure it belongs to the authenticated user
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }

        // Extract Cloudinary public_id from the imageUrl
        const imageUrl = travelStory.imageUrl;
        if (imageUrl) {
            const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public ID from URL

            // Delete the image from Cloudinary
            await cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    console.error("Cloudinary image deletion error:", error);
                }
            });
        }

        // Delete the travel story from the database
        await TravelStory.deleteOne({ _id: id, userId: userId });

        res.status(200).json({ message: "Travel story deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

// Update Favourite Status
const updateFavouriteStatus = async (req, res) => {
    const { id } = req.params;
    const { isFavourite } = req.body;
    const { userId } = req.user;

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }

        travelStory.isFavourite = isFavourite;

        await travelStory.save();
        res.status(200).json({ story: travelStory, message: 'Update Successful' });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

// Search Travel Stories
const searchStories = async (req, res) => {
    const { query } = req.query;
    const { userId } = req.user;

    if (!query) {
        return res.status(400).json({ error: true, message: "query is required" });
    }

    try {
        const searchResults = await TravelStory.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } },
                { visitedLocation: { $regex: query, $options: "i" } },
            ],
        }).sort({ isFavourite: -1 });

        res.status(200).json({ stories: searchResults });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

// Filter Stories by Date Range
const filterStoriesByDate = async (req, res) => {
    const { startDate, endDate } = req.query;
    const { userId } = req.user;

    try {
        // Convert startDate and endDate from milliseconds to Date objects
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        // Find travel stories that belong to the authenticated user and fall within the date range
        const filteredStories = await TravelStory.find({
            userId: userId,
            visitedDate: { $gte: start, $lte: end },
        }).sort({ isFavourite: -1 });

        res.status(200).json({ stories: filteredStories });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
};

module.exports = {
    addTravelStory,
    getAllStories,
    editStory,
    deleteStory,
    updateFavouriteStatus,
    searchStories,
    filterStoriesByDate
};
