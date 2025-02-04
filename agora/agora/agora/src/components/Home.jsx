import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Agora Video Call</h1>

      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomID}
        onChange={(e) => setRoomID(e.target.value)}
        style={{ padding: "10px", marginBottom: "10px", width: "200px" }}
      />
      <br />

      <button onClick={handleJoinRoom} style={{ marginRight: "10px" }}>
        Join Room
      </button>

      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
}

export default Home;
