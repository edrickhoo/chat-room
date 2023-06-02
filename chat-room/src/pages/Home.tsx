import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

interface HomeProps {
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
}

function Home({ user, setUser }: HomeProps) {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const joinRoom = (roomId: string) => {
    navigate(`room/${roomId}`);
  };

  const createRoom = () => {
    navigate(`room/${uuidv4()}`);
  };

  return (
    <>
      <div className="h-[90vh] flex justify-center items-center">
        <div className="border-2 p-10 space-y-4">
          <div>
            <label className="w-[100px] inline-block mr-2">User</label>
            <input
              className="px-2"
              onChange={(e) => setUser(e.target.value)}
              type="text"
              value={user}
            />
          </div>
          <div>
            <label className="w-[100px] inline-block mr-2">RoomId</label>
            <input
              className="px-2"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              type="text"
            />
          </div>

          <div className="flex justify-center mt-5 space-x-7">
            <button
              className="border px-2 py-1 rounded"
              onClick={() => createRoom()}
            >
              Create Room
            </button>
            <button
              className="border px-2 py-1 rounded"
              onClick={() => joinRoom(roomId)}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
