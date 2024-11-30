import express from 'express';
import { signup, login,  verifyEmail, getUserProfile } from '../controllers/authController.js';  // Ensure correct path and file extension
import {protect} from "../middleware/authMiddleware.js"
import User from "../models/User.js";
import bcrypt from 'bcryptjs'; 


const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.get("/refetch", protect, getUserProfile);

router.put("/profile/:id", async (req, res) => {
    const { firstName, lastName, phone, password } = req.body;
  
    try {
        const userID = req.params.id;
      const updatedUser = await User.findByIdAndUpdate(
        userID,
        { firstName, lastName, phone, password },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) return res.status(404).json({ message: "User not found." });
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.post("/change-password", async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "No account with that email found." });
      }
  
      // Check old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect old password' });
      }
  
      // Ensure new password is not the same as the old password
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: 'New password cannot be the same as the old password' });
      }
  
      // Check new password length
      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'New password must be at least 8 characters long' });
      }
  
      // const salt = await bcrypt.genSalt(10);
      user.password = newPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });



export default router;
