import React from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import Whiteboard from "./Whiteboard";

const Room = () => {
  const { roomId } = useParams();

  return (
    <div className="flex h-screen">
  <div className="flex-[1] border-r border-gray-300 overflow-auto">
    <CodeEditor roomId={roomId} />
  </div>
  <div className="flex-[2] overflow-auto">
    <Whiteboard roomId={roomId} />
  </div>
</div>

  );
};

export default Room;
