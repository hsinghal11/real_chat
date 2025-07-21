import { useEffect, useState } from "react";
import { Routes, BrowserRouter, Route } from "react-router";
import { io, Socket } from "socket.io-client";
import LoginPage from "./page/Login";
import SignUpPage from "./page/signup";
import ChatComponent from "./page/ChatPage";
import Home from "./page/Home";
// import { Button } from "./components/ui/button";
// import { Input } from "./components/ui/input";

const socket: Socket = io("http://localhost:8000", {
  withCredentials: true,
});

function App() {
  // const [message, setMessage] = useState("");
  // const [chatId, setChatId] = useState("1"); // Dummy chatId for testing

  // useEffect(() => {
  //   console.log("Connecting to socket...");

  //   socket.on("connect", () => {
  //     console.log("Connected:", socket.id);
  //   });

  //   socket.on("hello", (data) => {
  //     console.log("Hello event received:", data);
  //   });

  //   socket.on("receive_message", (data) => {
  //     console.log("New message received:", data);
  //   });

  //   socket.on("error", (err) => {
  //     console.error("Socket error:", err);
  //   });

  //   // Cleanup on unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // const handleJoinChat = () => {
  //   socket.emit("join_chat", chatId);
  //   console.log(`Joined chat room: chat_${chatId}`);
  // };

  // const handleSendMessage = () => {
  //   const messageData = {
  //     content: message,
  //     senderId: 1, // Dummy senderId for testing
  //     chatId: Number(chatId),
  //   };
  //   socket.emit("new message", messageData);
  //   console.log("Sent message:", messageData);
  //   setMessage("");
  // };

  // const handleHello = () => {
  //   socket.emit("hello", "Hello from frontend");
  // };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />{" "}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
