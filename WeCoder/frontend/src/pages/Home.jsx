import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const Home = () => {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();
  
    const handleCreateRoom = async () => {
      try {
        const response = await axios.post('http://localhost:3000/create-room');
        const newRoomId = response.data.roomId;
        navigate(`/room/${newRoomId}`);
      } catch (error) {
        console.error('Error creating room:', error);
      }
    };
  
    const handleJoinRoom = () => {
      if (roomId.trim()) {
        navigate(`/room/${roomId}`);
      } else {
        alert('Please enter a valid Room ID');
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Collaborative Code Editor</h1>
        <div className="space-y-4">
          <button
            onClick={handleCreateRoom}
            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
          >
            Create Room
          </button>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-500"
            />
            <button
              onClick={handleJoinRoom}
              className="px-6 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    );
};

export default Home;
