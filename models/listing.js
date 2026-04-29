const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=60",
    },
  },

  price: {
    type: Number,
    required: true,
    min: 0,
    max: 100000,
  },

  location: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  // 🗺️ NEW (IMPORTANT FOR MAP PERFORMANCE)
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: [Number] // [lng, lat]
  },

  category: {
    type: String,
    enum: [
      "Trending", "Rooms", "Cities", "Mountains",
      "Pools", "Camping", "Farms", "Pro",
      "Homes", "Nearby", "Fast", "Calendar",
      "Gifts", "Business"
    ]
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }

}, { timestamps: true });

// 🧹 DELETE REVIEWS CASCADE
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing?.reviews?.length) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);