import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

const resolveUserId = async (identifier) => {
  if (!identifier) return null;

  // If identifier looks like an email, resolve to user _id
  if (typeof identifier === "string" && identifier.includes("@")) {
    const found = await User.findOne({ email: identifier.toLowerCase() }).select("_id");
    return found?._id || null;
  }

  return identifier;
};

/* ---------- CREATE 1-to-1 CHAT ---------- */
export const createOneToOneChat = async (req, res) => {
  try {
    const { userId, email } = req.body; // accept either id or email for the other user
    const currentUserId = req.user.id;

    const targetId = await resolveUserId(userId || email);

    if (!targetId) {
      return res.status(400).json({ message: "Valid user email or id is required" });
    }

    if (targetId.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: "Cannot start a chat with yourself" });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [currentUserId, targetId] }
    });

    if (existingChat) {
      return res.json(existingChat);
    }

    // Create new chat
    const chat = await Chat.create({
      isGroup: false,
      participants: [currentUserId, targetId]
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------- CREATE GROUP CHAT ---------- */
export const createGroupChat = async (req, res) => {
  try {
    const { users, groupName } = req.body;

    if (!users || users.length < 2) {
      return res
        .status(400)
        .json({ message: "At least 3 users required" });
    }

    const resolvedUserIds = [];
    for (const u of users) {
      const id = await resolveUserId(u);
      if (id) resolvedUserIds.push(id);
    }

    // Remove duplicates and current user if already included later
    const uniqueIds = [...new Set(resolvedUserIds.map(id => id.toString()))];

    if (uniqueIds.length < 2) {
      return res.status(400).json({ message: "Could not resolve enough users by email" });
    }

    const chat = await Chat.create({
      isGroup: true,
      groupName,
      participants: [...uniqueIds, req.user.id],
      admin: req.user.id
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------- DELETE GROUP CHAT ---------- */
export const deleteGroupChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.isGroup) {
      return res.status(400).json({ message: "Only group chats can be deleted" });
    }

    if (!chat.admin || chat.admin.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only group admin can delete the chat" });
    }

    await Message.deleteMany({ chatId });
    await chat.deleteOne();

    try {
      if (global.io) {
        global.io.to(chatId.toString()).emit("chat_deleted", { chatId });
      }
    } catch (e) {
      console.error("Socket chat delete emit failed", e.message);
    }

    res.json({ message: "Chat deleted", chatId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------- GET USER CHATS ---------- */
export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id
    })
      .populate("participants", "username email")
      .populate("admin", "username email")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
