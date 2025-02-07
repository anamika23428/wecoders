import React from "react";
import { useParams } from "react-router-dom";
import VideoCall from "./VideoCall";
import Whiteboard from "./Whiteboard";
import CodeEditor from "./CodeEditor";

function Room() {
  const { roomId } = useParams(); // Get room ID from URL

  return (
    <div className="room flex flex-col h-screen">
      {/* Navbar */}
      <div className="navbar bg-red-500 text-white text-center py-4 text-xl font-bold">
        <h1>Room {roomId}</h1>
      </div>

      {/* Middle Section (fixed height, fills available space) */}
      <div className="middle flex flex-grow ">
        {/* Whiteboard (1/4 width) */}
        <div className="w-1/4 p-2 border-r border-gray-300 h-full">
          <CodeEditor />
        </div>
        {/* Code Editor (3/4 width) */}
        <div className="w-3/4 p-2 h-full">
          <Whiteboard />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom flex justify-center bg-gray-200 p-4">
        <VideoCall roomID={roomId} />
      </div>
    </div>
  );
}

export default Room;
