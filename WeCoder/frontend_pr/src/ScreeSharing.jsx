import React, { useState } from "react";
import { useCallStateHooks } from "@stream-io/video-react-sdk";

const ScreenSharing = ({ call }) => {
  const { useScreenShareState } = useCallStateHooks();
  const { status } = useScreenShareState();
  const [isSharing, setIsSharing] = useState(false);

  const toggleScreenShare = async () => {
    try {
      if (status === "enabled") {
        await call.screenShare.disable();
        setIsSharing(false);
        console.log("Screen sharing disabled");
      } else {
        await call.screenShare.enable();
        setIsSharing(true);
        console.log("Screen sharing enabled");
      }
    } catch (error) {
      console.error("Error toggling screen share:", error);
    }
  };

  const customizeSettings = async () => {
    try {
      call.screenShare.setSettings({
        maxFramerate: 15, // Clamp FPS between 1 and 15
        maxBitrate: 1500000, // Use at most 1.5 Mbps
      });
      console.log("Screen sharing settings updated.");
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  return (
    <div className="screen-share-container">
      <button
        onClick={toggleScreenShare}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {isSharing ? "Stop Screen Sharing" : "Start Screen Sharing"}
      </button>
      <button
        onClick={customizeSettings}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ml-2"
      >
        Customize Screen Share Settings
      </button>
      <p className="mt-4">
        Screen sharing is: <strong>{status === "enabled" ? "Active" : "Inactive"}</strong>
      </p>
    </div>
  );
};

export default ScreenSharing;
