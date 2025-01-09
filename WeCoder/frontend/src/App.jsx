import React from "react";
import CodeEditor from "./components/CodeEditor";
import VideoCall from "./components/VideoCall";

import ScreenSharing from "./components/ScreenSharing";
import Whiteboard from "./components/Whiteboard";

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl text-center mb-6">Collaborative Coding & Video Call</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-2xl mb-4">Code Editor</h2>
          <CodeEditor />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl mb-4">Video Call</h2>
          <VideoCall />
        </div>
        {/* <div className="flex-1">
          <h2 className="text-2xl mb-4">Whiteboard</h2>
          <Whiteboard />
        </div> */}
      </div>
    </div>
  );
};

export default App;