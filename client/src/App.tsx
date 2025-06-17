import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client"


function App() {
  const socket = useMemo(
    () =>
      io("http://localhost:8000", {
        transports: ["websocket"],
        withCredentials: true,
      }),
    []
  );

  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  
  useEffect(() => {
    socket.on("connect", () => {
      console.log(`connected to server with id : ${socket.id}`);
    });

    socket.on("hello", (data) => {
      console.log("Received from server:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  const sendInput = ()=>{
    socket.emit("hello", "Hello from client with ID: "+ socket.id+ "with message: "+ message);
    setMessage("");
  }

  return (
    <div>
      <h1>Socket prep started</h1>
      <input
        type="text"
        placeholder="typeHere"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendInput}>send message</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default App
