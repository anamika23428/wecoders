import React from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import Whiteboard from "./Whiteboard";

const Room = () => {
  const { roomId } = useParams();

  const containerStyle = {
    display: "flex",
    height: "100vh",
  };

  const editorStyle = {
    flex: 1,
    borderRight: "1px solid #ccc",
  };

  const whiteboardStyle = {
    flex: 1,
  };

  return (
    <div style={containerStyle}>
      <div style={editorStyle}>
        <CodeEditor roomId={roomId} />
      </div>
      <div style={whiteboardStyle}>
        <Whiteboard roomId={roomId} />
      </div>
    </div>
  );
};

export default Room;
