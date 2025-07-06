import { Router } from "express";
import { sendMessage, fetchMessages, deleteMessage } from "../controllers/message.controller";
import { verifyJWT } from "../middleware/auth.middlerware";

const router = Router();

router.route("/").post(verifyJWT, sendMessage);
router.route("/:chatId").get(verifyJWT, fetchMessages);
router.route("/delete/:messageId").delete(verifyJWT, deleteMessage);

export default router; 