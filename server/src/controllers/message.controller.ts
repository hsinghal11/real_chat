import { Request, Response } from "express";
import { prismaClient } from "../db";
import { asyncHandler } from "../utils/asyncHandler.util";
import { messageSchema } from "../validation/validate";

// Send a message
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const validated = messageSchema.safeParse(req.body);
  if (!validated.success) {
    return res.status(400).json({ success: false, message: validated.error.errors });
  }
  const { content, senderId, chatId } = validated.data;
  const message = await prismaClient.message.create({
    data: {
      content,
      senderId: Number(senderId),
      chatId: Number(chatId),
    },
    include: {
      sender: true,
      chat: true,
      readBy: true,
    },
  });
  // Update chat's latestMessage with the content
  await prismaClient.chat.update({
    where: { id: Number(chatId) },
    data: { latestMessage: content },
  });
  res.status(201).json({ success: true, message: "Message sent", data: message });
});

// Fetch all messages for a chat
export const fetchMessages = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  if (!chatId) {
    return res.status(400).json({ success: false, message: "Chat ID is required" });
  }
  const messages = await prismaClient.message.findMany({
    where: { chatId: Number(chatId) },
    include: { sender: true, readBy: true },
    orderBy: { createdAt: "asc" },
  });
  res.status(200).json({ success: true, data: messages });
});

// Delete a message
export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const { messageId } = req.params;
  if (!messageId) {
    return res.status(400).json({ success: false, message: "Message ID is required" });
  }
  // Authorization: Only sender can delete
  const message = await prismaClient.message.findUnique({ where: { id: Number(messageId) } });
  if (!message) {
    return res.status(404).json({ success: false, message: "Message not found" });
  }
  if (!req.user || message.senderId !== req.user.id) {
    return res.status(403).json({ success: false, message: "Not authorized to delete this message" });
  }
  await prismaClient.message.delete({ where: { id: Number(messageId) } });
  res.status(200).json({ success: true, message: "Message deleted" });
}); 