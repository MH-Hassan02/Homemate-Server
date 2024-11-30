// src/models/favorite.js
const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Reference to the Post model
    required: true,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
