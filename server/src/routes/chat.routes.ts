import { Router } from "express";
import {
  fetchChats,
  createOrFetchPrivateChat,
  getSingleChat,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup
} from "../controllers/chat.controller";
import { verifyJWT } from "../middleware/auth.middlerware";

const router = Router();

// Fetch all chats for current user
router.route("/").get(verifyJWT, fetchChats);
// Create or access private chat
router.route("/private").post(verifyJWT, createOrFetchPrivateChat);
// Get a single chat (group or personal)
router.route("/:chatId").get(verifyJWT, getSingleChat);
// Create group chat
router.route("/group").post(verifyJWT, createGroupChat);
// Rename group chat
router.route("/group/rename").put(verifyJWT, renameGroupChat);
// Add user(s) to group
router.route("/group/add").put(verifyJWT, addToGroup);
// Remove user(s) from group
router.route("/group/remove").put(verifyJWT, removeFromGroup);

export default router;