import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  sendMessage,
  getMessages,
  deleteMessage
} from "../controllers/message.controller.js";

const router = express.Router();

// Protected routes
router.post("/", authMiddleware, sendMessage);
router.get("/:chatId", authMiddleware, getMessages);
router.delete("/:id", authMiddleware, deleteMessage);

export default router;
