import Post from "../models/Post.js";
import jwt from "jsonwebtoken";

// Fetch all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error, could not fetch posts." });
  }
};

export const getUserPosts = async (req, res) => {
  const { userId } = req.query;
  try {
    const posts = await Post.find({ user: userId });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts." });
  }
};

// Fetch individual post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error, could not fetch post." });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "User is not authenticated" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decoded.userId;

    const {
      title,
      address,
      description,
      price,
      amenities,
      remarks,
      featuredAdd,
      details,
      location,
      area,
      deposit,
      images,
      utilityBill,
    } = req.body;

    const peopleLiving = details[0]?.peopleLiving;
    const bedsAvailable = details[0]?.bedsAvailable;

    // Create the post using the data
    const post = new Post({
      user: userId,
      title,
      address,
      description,
      price: parseInt(price),
      deposit: parseInt(deposit),
      amenities,
      images: images || [],
      location: {
        longitude: parseFloat(location.longitude),
        latitude: parseFloat(location.latitude),
      },
      remarks,
      featuredAdd,
      utilityBill: utilityBill,
      details: [
        {
          peopleLiving: parseInt(peopleLiving),
          bedsAvailable: parseInt(bedsAvailable),
        },
      ],
      area,
      rating: {}
    });

    const createdPost = await post.save();
    console.log("Post created:", createdPost);
    res.status(200).json(createdPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error, could not create post." });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { images, utilityBill, ...otherData } = req.body;

    // Find the existing post
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update the post with the new data
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        ...otherData,
        images: images || existingPost.images, // Directly use the images array from the request
        utilityBill: utilityBill || existingPost.utilityBill, // Update utility bill if provided
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Server error, could not update post." });
  }
};

export const getPostsByArea = async (req, res) => {
  try {
    const { area } = req.query;

    const allowedAreas = ["bahadurabad", "malir", "maymar", "jauhar", "saddar", "gulshan"];
    if (!allowedAreas.includes(area?.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid area. Allowed areas are bahadurabad, malir, maymar, jauhar, and saddar.",
      });
    }

    const posts = await Post.find({ area: area.toLowerCase() });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts by area:", error);
    res.status(500).json({ message: "Server error, could not fetch posts by area." });
  }
};

export const updatePostRating = async (req, res) => {
  const { id } = req.params;
  const { cleanliness, accuracy, checkin, communication, location, value } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    
    if (!post.rating) {
      post.rating = {};
    }

    post.rating.cleanliness = cleanliness || post.rating.cleanliness || 0;
    post.rating.accuracy = accuracy || post.rating.accuracy || 0;
    post.rating.checkin = checkin || post.rating.checkin || 0;
    post.rating.communication = communication || post.rating.communication || 0;
    post.rating.location = location || post.rating.location || 0;
    post.rating.value = value || post.rating.value || 0;

    const ratingsArray = [
      post.rating.cleanliness,
      post.rating.accuracy,
      post.rating.checkin,
      post.rating.communication,
      post.rating.location,
      post.rating.value
    ];
    
    const totalRatings = ratingsArray.reduce((acc, rating) => acc + rating, 0);
    const numberOfRatings = ratingsArray.filter(rating => rating > 0).length;
    
    post.rating.main = numberOfRatings > 0 ? totalRatings / numberOfRatings : 0;

    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



