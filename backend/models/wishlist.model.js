const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    destination: { type: String, required: true },
    description: { type: String, required: false },
    plannedDate: { type: Date, required: false },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], 
        default: 'Medium' 
    },
    estimatedBudget: { type: Number, required: false },
    notes: { type: String, required: false },
    imageUrl: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
