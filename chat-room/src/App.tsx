import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { io } from "socket.io-client";
import { Link, Route, Routes } from "react-router-dom";
import Room from "./pages/Room";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"],
});

interface MessageProps {
  mess: {
    user: string;
    message: string;
  };
}
const MessageCard = ({ mess }: MessageProps) => {
  const { user, message } = mess;
  return (
    <div className="flex space-x-2">
      <span>{user}:</span> <p>{message}</p>
    </div>
  );
};

function App() {
  const [user, setUser] = useState("");

  return (
    <>
      <nav className="flex justify-center items-center pt-4">
        <Link to={"/"}>Home</Link>
      </nav>
      <Routes>
        <Route
          path={"/room/:id"}
          element={<Room user={user} setUser={setUser} />}
        />
        <Route path={"/"} element={<Home user={user} setUser={setUser} />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
