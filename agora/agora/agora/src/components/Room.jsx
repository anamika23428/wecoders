import React from "react";
import { useParams } from "react-router-dom";
import VideoCall from "./VideoCall";
import Whiteboard from "./Whiteboard";
import CodeEditor from "./CodeEditor";

function Room() {
  const { roomId } = useParams(); // Get room ID from URL

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Room: {roomId}</h1>
      <Whiteboard />
      <CodeEditor />
      <VideoCall roomID={roomId} />
    </div>
  );
}

export default Room;
