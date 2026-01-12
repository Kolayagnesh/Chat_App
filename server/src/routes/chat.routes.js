import express from "express";
import {
  createOneToOneChat,
  createGroupChat,
  getUserChats,
  deleteGroupChat
} from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// All chat routes are protected
router.post("/one-to-one", authMiddleware, createOneToOneChat);
router.post("/group", authMiddleware, createGroupChat);
router.get("/", authMiddleware, getUserChats);
router.delete("/:chatId", authMiddleware, deleteGroupChat);

export default router;
