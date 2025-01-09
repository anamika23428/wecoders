import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const ScreenSharing = () => {
  const [client] = useState(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [localScreenTrack, setLocalScreenTrack] = useState(null);
  const [joined, setJoined] = useState(false);

const APP_ID = "687119f47f8246b389b6b41281c71d79"; // Replace with your Agora App ID
const TEMP_TOKEN = "007eJxTYDjpoz0v2vS1CFtkyZP4UywunBNM5oZGNT008bsz78PMJkUFBjMLc0NDyzQT8zQLIxOzJGMLyySzJBNDIwvDZHPDFHPLLruq9IZARob9Z78xMTJAIIjPwpCbmJnHwAAAsJId4g=="; // Replace with your Agora Temporary Token
const CHANNEL = "main"; // Replace with your channel name

  useEffect(() => {
    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
    };
  }, [client]);

  const joinStream = async () => {
    try {
      const UID = await client.join(APP_ID, CHANNEL, TEMP_TOKEN, null);
      console.log("Joined channel with UID:", UID);
      setJoined(true);
    } catch (error) {
      console.error("Error joining stream:", error);
    }
  };

  const leaveStream = async () => {
    try {
      if (localScreenTrack) {
        localScreenTrack.stop();
        localScreenTrack.close();
      }
      await client.leave();
      setLocalScreenTrack(null);
      setJoined(false);
      console.log("Left the stream.");
    } catch (error) {
      console.error("Error leaving stream:", error);
    }
  };

  const startScreenShare = async () => {
    try {
      const screenTrack = await AgoraRTC.createScreenVideoTrack();
      setLocalScreenTrack(screenTrack);

      const videoContainer = document.getElementById("screen-share-container");
      if (!videoContainer) {
        throw new Error("'screen-share-container' not found in the DOM.");
      }

      const player = createPlayer("local-screen");
      videoContainer.appendChild(player);
      screenTrack.play("user-local-screen");

      await client.publish(screenTrack);
      console.log("Screen sharing started and track published.");
    } catch (error) {
      console.error("Error starting screen sharing:", error);
    }
  };

  const stopScreenShare = async () => {
    if (localScreenTrack) {
      await client.unpublish(localScreenTrack);
      localScreenTrack.stop();
      localScreenTrack.close();
      setLocalScreenTrack(null);

      const videoContainer = document.getElementById("screen-share-container");
      if (videoContainer) videoContainer.innerHTML = "";
      console.log("Screen sharing stopped.");
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    try {
      await client.subscribe(user, mediaType);
      console.log("User published:", user);

      if (mediaType === "video") {
        let player = document.getElementById(`user-container-${user.uid}`);
        if (!player) {
          player = createPlayer(user.uid);
          document.getElementById("screen-share-container").appendChild(player);
        }
        user.videoTrack.play(`user-${user.uid}`);
        console.log("Playing video for user:", user.uid);
      }
    } catch (error) {
      console.error("Error handling user published:", error);
    }
  };

  const handleUserUnpublished = (user) => {
    console.log("User unpublished:", user.uid);
    const player = document.getElementById(`user-container-${user.uid}`);
    if (player) player.remove();
  };

  const createPlayer = (uid) => {
    const player = document.createElement("div");
    player.className = "video-container border rounded shadow-md p-2 bg-white";
    player.id = `user-container-${uid}`;
    player.innerHTML = `
      <div class="video-player w-full h-64" id="user-${uid}"></div>
    `;
    return player;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {!joined ? (
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={joinStream}
        >
          Join Stream
        </button>
      ) : (
        <div className="space-x-4">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            onClick={leaveStream}
          >
            Leave Stream
          </button>
          {!localScreenTrack ? (
            <button
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              onClick={startScreenShare}
            >
              Start Screen Share
            </button>
          ) : (
            <button
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
              onClick={stopScreenShare}
            >
              Stop Screen Share
            </button>
          )}
        </div>
      )}
      <div
        id="screen-share-container"
        className="grid grid-cols-2 gap-4 mt-6 w-full max-w-4xl"
      ></div>
    </div>
  );
};

export default ScreenSharing;