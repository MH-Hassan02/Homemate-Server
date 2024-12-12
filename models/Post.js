import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    details: [
      {
        peopleLiving: {
          type: Number,
        },
        bedsAvailable: {
          type: Number,
        },
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    deposit: {
      type: Number,
      required: true,
    },
    amenities: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String, // URLs of uploaded images (using Cloudinary, for example)
      },
    ],
    remarks: {
      type: String,
    },
    location: {
      longitude: {
        type: Number,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
    },
    area:{
      type: String,
      required: true
    },
    utilityBill: {
      type: String, // URL for the utility bill image
    },
    featuredAdd: {
      type: Boolean,
      default: false,
    },
    rating: {
      cleanliness: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      checkin: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
      value: { type: Number, default: 0 },
      main: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
