import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Import Toastify
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify CSS
import VideoCall from "./VideoCall";
import Whiteboard from "./Whiteboard";
import CodeEditor from "./CodeEditor";
import Chat from "./chat";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import socket from "./socket";

function Room() {
  const { roomId, userName } = useParams();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (roomId && userName) {
      socket.emit("join-room", { roomId, userName });

      // ✅ Show toast when user joins
      toast.success(`You joined room ${roomId}!`);
    }

    // ✅ Listen for other users joining
    socket.on("user-joined", (data) => {
      if (data.userName !== userName) {
        toast.info(`${data.userName} joined the room.`);
      }
    });

    // ✅ Listen for users leaving
    socket.on("user-left", (data) => {
      toast.warning(`${data.userName} left the room.`);
    });

    return () => {
      socket.emit("leave-room", roomId);
      toast.error(`You left room ${roomId}.`);
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, [roomId, userName]);

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
