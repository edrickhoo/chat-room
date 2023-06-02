import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Room from "./pages/Room";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

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
