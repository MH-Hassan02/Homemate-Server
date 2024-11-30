import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; 
// Define user schema
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, unique: true, required: true, match: /.+\@.+\..+/ }, 
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    profilePicture: {
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      type: String,
    },
  },
  {
    timestamps: true, 
  }
);


userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Create User model
const User = mongoose.model('User', userSchema);

// Export User model
export default User;
