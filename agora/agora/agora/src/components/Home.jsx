import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from './Hero.jsx';
function Home() {
  const [roomID, setRoomID] = useState("");
  const navigate = useNavigate();

  async function handleCreateRoom() {
    try {
      const response = await fetch("http://localhost:5000/create-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log(data);
      if (data.roomId) {
        navigate(`/room/${data.roomId}`);
      } else {
        alert("Failed to create a room. Try again.");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Error creating room.");
    }
  }

  function handleJoinRoom() {
    if (!roomID) {
      alert("Please enter a Room ID!");
      return;
    }
    navigate(`/room/${roomID}`);
  }

  return (
    <div className="flex w-screen overflow-hidden ">
     <div className="w-1/2 flex flex-col items-center justify-center text-center p-6">
      <h1 children className="">Agora Call
      <span className="waving-hand">👋</span>
      </h1>

      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomID}
        onChange={(e) => setRoomID(e.target.value)}
        style={{ padding: "10px", marginTop: "20px",width: "200px" }}
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
