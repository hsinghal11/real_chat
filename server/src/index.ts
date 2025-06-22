import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";


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
});

app.get("/", (req, res) => {
  res.send("Hello from TypeScript + Express!");
});

// import routers 

import userRouter from "./routes/user.routes";

app.use("/api/v1/user", userRouter);

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
