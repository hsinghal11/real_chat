import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import messageRouter from "./routes/message.routes";
import { prismaClient } from "./db";

const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = 8000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
})) 

io.on("connection", (socket: Socket) => {
    console.log("USer connected", socket.id);  
    socket.on("hello", (data) => {
        // log.info("Hello event received", data);
        console.log("Hello event received", data);
        io.emit("hello", `${data}`);
    });
    // Join chat room
    socket.on("join_chat", (chatId) => {
        socket.join(`chat_${chatId}`);
    });
    // Send message
    socket.on("send_message", async (data) => {
        // data: { content, senderId, chatId }
        // Save message to DB
        try {
            const message = await prismaClient.message.create({
                data: {
                    content: data.content,
                    senderId: Number(data.senderId),
                    chatId: Number(data.chatId),
                },
                include: { sender: true, readBy: true },
            });
            // Update chat's latestMessage with the content
            await prismaClient.chat.update({
                where: { id: Number(data.chatId) },
                data: { latestMessage: data.content },
            });
            // Emit to all in chat room
            io.to(`chat_${data.chatId}`).emit("receive_message", message);
        } catch (err) {
            socket.emit("error", { message: "Failed to send message" });
        }
    });
});

app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Express!");
});

// import routers 

import userRouter from "./routes/user.routes";
import { errorHandler } from "./middleware/errorHandler";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
