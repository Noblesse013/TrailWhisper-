const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    itemType: { 
        type: String, 
        enum: ['TravelStory', 'Destination'], 
        required: true 
    },
    itemId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdOn: { type: Date, default: Date.now },
    
    notes: { type: String, required: false },
    tags: [{ type: String }]
});


favoriteSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
