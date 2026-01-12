import mongoose from "mongoose";

// User schema defines how a user looks in the database
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,   // no two users can have same username
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    isOnline: {
      type: Boolean,
      default: false
    },

    lastSeen: {
      type: Date
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt automatically
  }
);

// Export User model
export default mongoose.model("User", userSchema);
