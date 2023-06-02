import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
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
      <span>{user}:</span>{" "}
      <p className="max-w-[470px] break-words">{message}</p>
    </div>
  );
};

interface RoomProps {
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
}

interface Message {
  user: string;
  message: string;
}

function Room({ user, setUser }: RoomProps) {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [userList, setUserList] = useState<string[]>([]);
  const messageWindow = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageWindow?.current?.lastElementChild?.scrollIntoView({
      block: "end",
      inline: "nearest",
      behavior: "smooth",
    });
  };

  useEffect(() => {
    socket.connect();
    socket.on("connection", (data) => {
      console.log(data, "connection");
      setUserList(data);
    });

    socket.on("disc", (data) => {
      console.log(data);
      setUserList([...data]);
    });

    socket.on("messages", (mess) => {
      setMessages((prev) => [...prev, mess]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.emit("join", id);
    socket.emit("connection", { name: user, roomId: id });
  }, [id, user]);

  useEffect(() => {
    const getUsername = () => {
      let newUsername = prompt("Please enter a username");
      while (!newUsername) {
        newUsername = prompt("Please enter a username");
      }

      setUser(newUsername);
    };

    if (!user) {
      getUsername();
    }
  }, [setUser, user]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("messages", { user: user, message: messageInput, roomId: id });
    setMessageInput("");
  };

  const copyURL = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Link copied to clipboard");
  };

  return (
    <>
      <div className="max-w-[1440px] mx-auto flex flex-col items-center py-10 w-full">
        <div className="flex max-w-[800px] items-center justify-end w-full mb-2 mr-28">
          <button onClick={copyURL}>Share</button>
        </div>
        <div className="flex mb-4 w-full justify-center">
          <div
            ref={messageWindow}
            className="border p-3  max-w-[600px] w-full h-[700px] overflow-y-scroll"
          >
            <div className="pb-5">
              {messages &&
                messages.length > 0 &&
                messages.map((message, idx) => {
                  return <MessageCard key={idx} mess={message} />;
                })}
            </div>
          </div>
          <div className="w-[200px] h-[700px] overflow-auto border border-l-0 flex flex-col items-center">
            <div className="bold mb-3">User List</div>
            <div>
              {userList &&
                userList.length > 0 &&
                userList.map((user, idx) => {
                  return (
                    <div key={idx} className="">
                      {user}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div>
          <form onSubmit={(e) => sendMessage(e)}>
            <input
              className="border px-2"
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button className="border px-2">Send</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Room;
