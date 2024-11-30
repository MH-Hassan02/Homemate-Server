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
    ratings: {
      type: Number,
      default: 0,
    },
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
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
