import { io } from "socket.io-client"


function App() {
  const socket = io("http://localhost:3000", {
    autoConnect: false,
  });
  socket.connect();
  socket.emit("hello", "Hello from client!");
  socket.on("hello", (data) => {
    console.log(data);
  });
  return (
    <div>

    </div>
  )
}

export default App
