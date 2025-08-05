const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../utilities");
const {
    addTravelStory,
    getAllStories,
    editStory,
    deleteStory,
    updateFavouriteStatus,
    searchStories,
    filterStoriesByDate
} = require("../controllers/travelStoryController");

router.post("/add-travel-story", authenticateToken, addTravelStory);
router.get("/get-all-stories", authenticateToken, getAllStories);
router.put("/edit-story/:id", authenticateToken, editStory);
router.delete("/delete-story/:id", authenticateToken, deleteStory);
router.put("/update-is-favourite/:id", authenticateToken, updateFavouriteStatus);
router.get("/search", authenticateToken, searchStories);
router.get("/travel-stories/filter", authenticateToken, filterStoriesByDate);

module.exports = router;
