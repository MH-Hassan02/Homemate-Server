import User from '../models/User.js';
import Post from '../models/Post.js';

// Add favorite
export const addFavorite = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!user.favorites.includes(postId)) {
      user.favorites.push(postId);
      await user.save();
      return res.status(200).json({ message: "Post added to favorites", data:res.data });
    } else {
      return res.status(400).json({ message: "Post is already in favorites" });
    }
  } catch (error) {
    console.error("Error adding favorite:", error);
    return res.status(500).json({ error: error.message });
  }
};


export const removeFavorite = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favorites = user.favorites.filter((id) => id.toString() !== postId);
    await user.save();
    res.status(200).json({ message: "Post removed from favorites" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getUserFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('favorites');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ favorites: user.favorites });  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
