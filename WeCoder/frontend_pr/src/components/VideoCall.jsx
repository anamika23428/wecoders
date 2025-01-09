import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";

const APP_ID = "687119f47f8246b389b6b41281c71d79"; // Replace with your Agora App ID
const TEMP_TOKEN = "007eJxTYLjiHDY3c/XD03N7HhgVvPgh8XTFA5eLR4zy7afEL366ouy9AoOZhbmhoWWaiXmahZGJWZKxhWWSWZKJoZGFYbK5YYq5pf2bivSGQEaG9wrqzIwMEAjiszDkJmbmMTAAADxVIdo="; // Replace with your Agora Temporary Token
const CHANNEL = "main"; // Replace with your channel name

const App = () => {
  const [client] = useState(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [localTracks, setLocalTracks] = useState([]);
  const [joined, setJoined] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  useEffect(() => {
    client.on("user-published", handleUserJoined);
    client.on("user-unpublished", handleUserLeft);

    return () => {
      client.off("user-published", handleUserJoined);
      client.off("user-unpublished", handleUserLeft);
    };
  }, [client]);

  const joinStream = async () => {
    if (client.connectionState !== "DISCONNECTED") {
      console.error("Client is already connecting or connected.");
      return;
    }

    try {
      const UID = await client.join(APP_ID, CHANNEL, TEMP_TOKEN, null);
      console.log("Joined channel with UID:", UID);

      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalTracks(tracks);

      const videoContainer = document.getElementById("video-streams");
      if (!videoContainer) {
        throw new Error("'video-streams' container is not found in the DOM.");
      }

      const player = createPlayer(UID);
      videoContainer.appendChild(player);

      tracks[1].play(`user-${UID}`);
      console.log("Local video track played for UID:", UID);

      await client.publish(tracks);
      console.log("Local tracks published.");

      setJoined(true);
    } catch (error) {
      console.error("Error joining stream:", error);
    }
  };

  const leaveStream = async () => {
    try {
      localTracks.forEach((track) => {
        track.stop();
        track.close();
      });

      await client.leave();
      setLocalTracks([]);
      setJoined(false);

      const videoContainer = document.getElementById("video-streams");
      if (videoContainer) videoContainer.innerHTML = "";

      console.log("Left the stream.");
    } catch (error) {
      console.error("Error leaving stream:", error);
    }
  };

  const handleUserJoined = async (user, mediaType) => {
    try {
      await client.subscribe(user, mediaType);
      console.log("User subscribed:", user);

      if (mediaType === "video") {
        let player = document.getElementById(`user-container-${user.uid}`);
        if (!player) {
          player = createPlayer(user.uid);
          document.getElementById("video-streams").appendChild(player);
        }
        user.videoTrack.play(`user-${user.uid}`);
        console.log("Playing video for user:", user.uid);
      }

      if (mediaType === "audio") {
        user.audioTrack.play();
        console.log("Playing audio for user:", user.uid);
      }
    } catch (error) {
      console.error("Error handling user joined:", error);
    }
  };

  const handleUserLeft = (user) => {
    console.log("User left:", user.uid);
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

  const toggleAudio = async () => {
    if (audioEnabled) {
      localTracks[0].setEnabled(false); // Disable the microphone
      setAudioEnabled(false);
    } else {
      localTracks[0].setEnabled(true); // Enable the microphone
      setAudioEnabled(true);
    }
  };

  const toggleVideo = async () => {
    if (videoEnabled) {
      localTracks[1].setEnabled(false); // Disable the video
      setVideoEnabled(false);
    } else {
      localTracks[1].setEnabled(true); // Enable the video
      setVideoEnabled(true);
    }
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
          <button
            className={`bg-${audioEnabled ? "red" : "cyan"}-500 text-white py-2 px-4 rounded hover:bg-${audioEnabled ? "red" : "cyan"}-600`}
            onClick={toggleAudio}
          >
            {audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
            {audioEnabled ? "Mute Microphone" : "Unmute Microphone"}
          </button>
          <button
            className={`bg-${videoEnabled ? "red" : "cyan"}-500 text-white py-2 px-4 rounded hover:bg-${videoEnabled ? "red" : "cyan"}-600`}
            onClick={toggleVideo}
          >
            {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
            {videoEnabled ? "Turn Off Video" : "Turn On Video"}
          </button>
        </div>
      )}
      <div
        id="video-streams"
        className="grid grid-cols-2 gap-4 mt-6 w-full max-w-4xl"
      ></div>
    </div>
  );
};

export default App;
