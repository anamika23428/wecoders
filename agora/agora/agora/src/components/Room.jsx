import React from "react";
import { useParams } from "react-router-dom";
import VideoCall from "./VideoCall";
import Whiteboard from "./Whiteboard";
import CodeEditor from "./CodeEditor";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function Room({ name }) {
  const { roomId } = useParams(); // Get room ID from URL

  return (
    <div className="room flex flex-col w-screen h-screen overflow-hidden">
      {/* Navbar */}
      <div className="navbar bg-red-500 text-white text-center py-4 text-xl font-bold">
        <h1>Room {roomId} - {name}</h1>
      </div>

      {/* Middle Section with Resizable Panels */}
      <PanelGroup direction="horizontal" className="flex-grow overflow-hidden">
        {/* Code Editor (resizable) */}
        <Panel defaultSize={33} minSize={20}>
          <div className="p-2 h-full overflow-auto">
            <CodeEditor />
          </div>
        </Panel>

        {/* Resize Handle */}
        <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-blue-500 transition-colors" />

        {/* Whiteboard (resizable) */}
        <Panel defaultSize={33} minSize={20}>
          <div className="p-2 h-full overflow-auto">
            <Whiteboard />
          </div>
        </Panel>

        {/* Resize Handle */}
        <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-blue-500 transition-colors" />

        {/* Video Call (resizable) */}
        <Panel defaultSize={34} minSize={20}>
          <div className="p-2 h-full overflow-auto">
            <VideoCall roomID={roomId} name={name} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default Room;
