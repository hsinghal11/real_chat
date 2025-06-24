import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.util";
import { prismaClient } from "../db";
import { groupChatSchema } from "../validation/validate";
import z from "zod";

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  pic: true,
};

// 0️⃣ Fetch all chats for current user
export const fetchChats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({
      message: "User not found on fetching user",
    });
  }

  const chats = await prismaClient.chat.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    include: {
      users: {
        select: safeUserSelect,
      },
      groupAdmins: {
        select: safeUserSelect,
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (chats.length === 0) {
    return res.status(401).json({
      success: false,
      message: "No chats found for the user",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Chat fetched successfully",
    data: chats,
  });
});

// 1️⃣ Create or access Private chat 
export const createOrFetchPrivateChat = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body;
    const currentUserId = req.user?.id;

    if (!userId || !currentUserId) {
      return res.status(400).json({
        success: false,
        message: "missing the user details",
      });
    }

    const isChatExists = await prismaClient.chat.findFirst({
      where: {
        isGroupChat: false,
        users: {
          some: { id: currentUserId },
        },
        AND: {
          users: {
            some: { id: userId },
          },
        },
      },
      include: {
        users: {
          select: safeUserSelect,
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 30,
        },
      },
    });
    if (isChatExists)
      return res.status(200).json({
        success: true,
        message: "chat accessed succesfully",
        data: isChatExists,
      });

    const newChat = await prismaClient.chat.create({
      data: {
        isGroupChat: false,
        chatName: "sender",
        users: {
          connect: [{ id: userId }, { id: currentUserId }],
        },
      },
      include: {
        users: {
          select: safeUserSelect,
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: "chat created succesfully",
      data: newChat,
    });
  }
);

// 2️⃣ Get a single chat (group or personal)
export const getSingleChat = asyncHandler(
  async (req: Request, res: Response) => {
    const chatId = req.params.chatId;
    const userId = req.user?.id;

    if (!chatId || !userId) {
      return res.status(400).json({ message: "Chat ID and user ID required" });
    }

    const chat = await prismaClient.chat.findFirst({
      where: {
        id: Number(chatId),
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: { select: safeUserSelect },
        groupAdmins: { select: safeUserSelect },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!chat)
      return res
        .status(404)
        .json({ message: "Chat not found or access denied" });

    return res
      .status(200)
      .json({ success: true, message: "Chat fetched succesfully", data: chat });
  }
);

// 3️⃣ Create group chat
export const createGroupChat = asyncHandler(
  async (req: Request, res: Response) => {
    const validated = groupChatSchema.safeParse(req.body);
    if (!validated.success) {
      return res
        .status(400)
        .json({ success: false, message: validated.error.errors });
    }

    const { users, chatName, groupPic } = validated.data;
    const currentUserId = req.user?.id;
    const allUserIds = [...users, currentUserId];

    const createdChat = await prismaClient.chat.create({
      data: {
        chatName: chatName!,
        isGroupChat: true,
        groupPic,
        users: { connect: allUserIds.map((id) => ({ id: Number(id) })) },
        groupAdmins: { connect: { id: currentUserId } },
      },
      include: {
        users: { select: safeUserSelect },
        groupAdmins: { select: safeUserSelect },
      },
    });

    return res.status(201).json({
      success: true,
      message: "group created succesfully",
      data: createdChat,
    });
  }
);

// 4️⃣ Rename group chat
export const renameGroupChat = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId, newName } = req.body;
    if (!chatId || !newName)
      return res.status(400).json({ message: "Missing chatId or newName" });

    const updatedChat = await prismaClient.chat.update({
      where: { id: Number(chatId) },
      data: { chatName: newName },
      include: {
        users: { select: safeUserSelect },
        groupAdmins: { select: safeUserSelect },
      },
    });

    return res.status(200).json({ success: true, chat: updatedChat });
  }
);

// 5️⃣ Add user to group
export const addToGroup = asyncHandler(async (req: Request, res: Response) => {
  const { chatId, userIds } = req.body;
  if (!chatId || !userIds)
    return res.status(400).json({ message: "Missing chatId or userId" });

  const updatedChat = await prismaClient.chat.update({
    where: { id: Number(chatId) },
    data: {
      users: {
        connect: userIds.map((userId: number) => ({ id: Number(userId) })),
      },
    },
    include: {
      users: { select: safeUserSelect },
      groupAdmins: { select: safeUserSelect },
    },
  });

  return res.status(200).json({ success: true, chat: updatedChat });
});

// 6️⃣ Remove user from group
export const removeFromGroup = asyncHandler(
  async (req: Request, res: Response) => {
    const schema = z.object({
      chatId: z.number(),
      userIds: z.array(z.number()).min(1),
    });
    const { chatId, userIds } = schema.parse(req.body);
    if (!chatId || !userIds)
      return res.status(400).json({ message: "Missing chatId or userId" });

    const updatedChat = await prismaClient.chat.update({
      where: { id: Number(chatId) },
      data: {
        users: {
          disconnect: userIds.map((userId: number) => ({ id: Number(userId) })),
        },
      },
      include: {
        users: { select: safeUserSelect },
        groupAdmins: { select: safeUserSelect },
      },
    });

    return res.status(200).json({
      success: true,
      message: "removed users succesfully",
      data: updatedChat,
    });
  }
);
