const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const travelStorySchema = new Schema({
    title: { type: String, required: true },
    story: { type: String, required: true },
    visitedLocation: { type: String, required: true }, 
    isFavourite: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true},
    createdOn: { type: Date, default: Date.now },
    imageUrl: { type: String, required: false }, // Keep for backward compatibility
    images: [{ 
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
    }], // Support multiple images
    visitedDate: { type: Date, required: true }, 
});

module.exports = mongoose.model("TravelStory", travelStorySchema);