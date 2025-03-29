import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Import Toastify
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify CSS
import Hero from "./Hero.jsx";

function Home() {
  const [roomID, setRoomID] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  async function handleCreateRoom() {
    if (!userName.trim()) {
      toast.warn("Please enter your name before creating a room!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/create-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName }), // Send username to backend
      });

      const data = await response.json();
      console.log("Data in room:", data); // { roomId: "...", userName: "..." }

      if (data.roomId) {
        toast.success(`Room ${data.roomId} created successfully!`);
        navigate(`/room/${data.roomId}/${data.userName}`); // Include username in URL
      } else {
        toast.error("Failed to create a room. Try again.");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Error creating room. Please try again.");
    }
  }

  function handleJoinRoom() {
    if (!roomID.trim()) {
      toast.warn("Please enter a Room ID!");
      return;
    }
    if (!userName.trim()) {
      toast.warn("Please enter your name!");
      return;
    }
    toast.success(`Joining Room ${roomID}...`);
    navigate(`/room/${roomID}/${encodeURIComponent(userName)}`);
  }

  return (
    <div className="flex w-screen overflow-hidden ">
      <div className="w-1/2 flex flex-col items-center justify-center text-center p-6">
        <h1 className="">Agora Call
          <span className="waving-hand">👋</span>
        </h1>

        <input
          type="text"
          placeholder="Enter Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ padding: "10px", marginTop: "20px", width: "200px" }}
        />

        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value)}
          style={{ padding: "10px", marginTop: "20px", width: "200px" }}
        />
        <br />

        <button onClick={handleJoinRoom} className="mt-1">
          Join Room
        </button>

        <button onClick={handleCreateRoom}>Create Room</button>
      </div>

      <Hero />
    </div>
  );
}

export default Home;
