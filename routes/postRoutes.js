import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByArea,
  getUserPosts,
  updatePost,
  updatePostRating,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../config/multerConfig.js";
import { getUserFavorites } from "../controllers/favoriteController.js";
const router = express.Router();

router.get("/posts", getAllPosts);
router.get("/user", protect, getUserPosts);
router.get("/post/:id", getPostById);
router.post("/createpost", protect, upload.array("images", 5), createPost);
router.put("/editPost/:id", protect, updatePost);
router.get("/favorites/:userId", protect, getUserFavorites);
router.get("/search", getPostsByArea);
router.put("/post/:id/rate", protect, updatePostRating)

export default router;
