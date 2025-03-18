import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import VideoCall from "./VideoCall";
import Whiteboard from "./Whiteboard";
import CodeEditor from "./CodeEditor";
import Chat from "./chat";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function Room() {
  const { roomId , userName } = useParams(); // Get room ID from URL
  const location = useLocation(); // Get state from navigation
  const [showChat, setShowChat] = useState(false);

  // Store userName in sessionStorage for persistent access
  
  
  useEffect(() => {
    sessionStorage.setItem("userName", userName); // Ensure it's stored for Chat.js
  }, [userName]);

  console.log("User:", userName); // Debugging log

  return (
    <div className="room flex flex-col w-screen h-screen overflow-hidden">
      {/* Navbar */}
      <div className="navbar bg-[#1E3A8A] text-white flex justify-between items-center py-3 px-4">
        <h1 className="text-[14px] font-bold">Room {roomId} - {userName}</h1>
        <button
          onClick={() => setShowChat(true)}
          className="bg-blue-500 px-3 py-1 text-white rounded"
        >
          Open Chat
        </button>
      </div>

      {/* Middle Section with Resizable Panels */}
      <PanelGroup direction="horizontal" className="flex-grow overflow-hidden">
        <Panel defaultSize={33} minSize={20}>
          <div className="p-2 h-full overflow-auto">
            <CodeEditor />
          </div>
        </Panel>

        <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-blue-500 transition-colors" />

        <Panel defaultSize={33} minSize={20}>
          <div className="p-2 h-full overflow-auto">
            <Whiteboard />
          </div>
        </Panel>

        <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-blue-500 transition-colors" />

        <Panel defaultSize={34} minSize={20}>
          <div className="p-2 h-full overflow-auto">
            <VideoCall roomID={roomId} name={userName} />
          </div>
        </Panel>
      </PanelGroup>

      {/* Chat Panel */}
      {showChat && <Chat onClose={() => setShowChat(false)} />}
    </div>
  );
}

export default Room;
