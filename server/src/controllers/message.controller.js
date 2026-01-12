import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

/* ---------- SEND MESSAGE ---------- */
export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({
        message: "chatId and content are required"
      });
    }

    const message = await Message.create({
      chatId,
      senderId: req.user.id,
      content
    });

    // populate sender for response and socket emission
    const populated = await Message.findById(message._id).populate("senderId", "username email");

    // emit to chat room so connected clients receive the message
    try {
      if (global.io) {
        global.io.to(chatId).emit("receive_message", populated);
      }
    } catch (e) {
      console.error("Socket emit failed", e.message);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------- DELETE MESSAGE ---------- */
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can delete only your messages" });
    }

    await message.deleteOne();

    try {
      if (global.io) {
        global.io.to(message.chatId.toString()).emit("delete_message", { messageId: id });
      }
    } catch (e) {
      console.error("Socket delete emit failed", e.message);
    }

    res.json({ message: "Deleted", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------- GET ALL MESSAGES OF A CHAT ---------- */
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId })
      .populate("senderId", "username email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
