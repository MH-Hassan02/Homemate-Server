import User from "../models/User.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

// Register Controller
export const signup = async (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = new User({
      firstName,
      email,
      lastName,
      phone,
      password,
      verificationToken,
    });

    // Save user
    await user.save();

    // Send verification email
    const verificationLink = `http://localhost:5000/auth/verify-email?token=${verificationToken}`;

    sendEmail(email, verificationLink);

    res.status(200).json({
      message:
        "Registration successful! Check your email to verify your account.",
    });
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
};

// Verify Email Controller
export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    // Find user by verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).send("Invalid token");
    }

    // Verify email and clear token
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).send("Email verified successfully");
  } catch (error) {
    res.status(400).send("Error verifying email");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(400).send("Please verify your email first");
    }

    // Validate password
    console.log(password, "password");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Return both the token and user details
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).lean();

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      favorites: user.favorites,
      profilePicture: user.profilePicture,
      isAdmin: user.isAdmin || false,
    });
  } else {
    res.status(404);
    res.json({ message: "User not found" });
  }
};
