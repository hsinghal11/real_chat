import express from "express";
import { Server } from "socket.io";
import http from "http";
import { ILogObj, Logger } from "tslog";
import cookieParser from "cookie-parser";


const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
});

const log: Logger<ILogObj> = new Logger();

io.listen(4000);

io.on("connection", (socket) => {
    log.info("User connected", socket.id);
    console.log("USer connected", socket.id);  
    socket.on("hello", (data) => {
        log.info("Hello event received", data);
        console.log("Hello event received", data);
        socket.emit("hello", "Hello from server!");
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
