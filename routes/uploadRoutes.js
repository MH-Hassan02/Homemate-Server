import express from "express";
import multer from "../config/multerConfig.js";
import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs"; // Import File System module
import upload from "../config/multerConfig.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Function to delete file from the upload folder
const deleteFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error("Failed to delete file:", path, err);
    }
  });
};

// Upload image to Cloudinary
router.post("/images", protect, upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    const uploadPromises = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path);
      deleteFile(file.path); // Delete file from upload folder after upload
      return result.secure_url;
    });

    const imageUrls = await Promise.all(uploadPromises);

    const postId = req.body.postId;
    await Post.findByIdAndUpdate(postId, {
      $push: { images: { $each: imageUrls } },
    });

    res.json({
      message: "Images uploaded successfully",
      imageUrls,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ message: "Failed to upload images", error: error.message });
  }
});

// Upload utility image to Cloudinary
router.post(
  "/utilityimage",
  protect,
  multer.single("utility"),
  async (req, res) => {
    try {
      const postId = req.body.postId;
      const existingPost = await Post.findById(postId);

      if (!req.file) {
        return res.status(400).json({ message: "No file was uploaded." });
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      deleteFile(req.file.path); // Delete file from upload folder after upload

      await Post.findByIdAndUpdate(postId, { utilityImage: result.secure_url });

      res.json({
        message: "Image uploaded successfully",
        imageUrl: result.secure_url,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to upload image", error: error.message });
    }
  }
);

// Route to upload and update profile picture
router.post(
  "/profilePicture",
  protect,
  multer.single("profilePicture"),
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      deleteFile(req.file.path); // Delete file from upload folder after upload

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.profilePicture = result.secure_url;
      await user.save();

      res.json({
        message: "Profile picture updated successfully",
        imageUrl: result.secure_url,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to upload image",
        error: error.message,
      });
    }
  }
);

router.delete("/profilePicture", protect, async (req, res) => {
  const { userId } = req.body;

  try {
    const existingUser = await User.findById(userId);

    if (!existingUser || !existingUser.profilePicture) {
      return res.status(404).json({ message: "Profile Picture not found" });
    }

    const publicId = existingUser.profilePicture.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    await User.findByIdAndUpdate(userId, { profilePicture: null });

    res.json({ message: "Profile Picture removed successfully" });
  } catch (error) {
    console.error("Delete Profile Picture error:", error);
    res
      .status(500)
      .json({ message: "Failed to remove Profile Picture", error: error.message });
  }
});

// Delete image from Cloudinary and database
router.delete("/images", protect, async (req, res) => {
  const { imageUrl, postId } = req.body;

  try {
    const publicId = imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    await Post.findByIdAndUpdate(postId, { $pull: { images: imageUrl } });

    res.json({ message: "Image removed successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res
      .status(500)
      .json({ message: "Failed to remove image", error: error.message });
  }
});

// Delete utility bill from Cloudinary and database
router.delete("/utilitybill", protect, async (req, res) => {
  const { postId } = req.body;

  try {
    const existingPost = await Post.findById(postId);

    if (!existingPost || !existingPost.utilityBill) {
      return res.status(404).json({ message: "Utility bill not found" });
    }

    const publicId = existingPost.utilityBill.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    await Post.findByIdAndUpdate(postId, { utilityBill: null });

    res.json({ message: "Utility bill removed successfully" });
  } catch (error) {
    console.error("Delete utility bill error:", error);
    res
      .status(500)
      .json({ message: "Failed to remove utility bill", error: error.message });
  }
});

export default router;
