import mongoose from "mongoose";

// Chat schema for 1-to-1 and group chats
const chatSchema = new mongoose.Schema(
  {
    isGroup: {
      type: Boolean,
      default: false
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // references User collection
        required: true
      }
    ],

    groupName: {
      type: String,
      trim: true
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Chat", chatSchema);
