import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import "../App.css"; // Assuming `app.css` is in the root directory outside `components`

const APP_ID = "your-agora-app-id"; // Replace with your Agora App ID
const SERVER_URL = "http://localhost:5000"; // Your backend server URL
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

function VideoCall({ roomID }) {
  const [joined, setJoined] = useState(false);
  const [streamStarted, setStreamStarted] = useState(false);
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteUsers, setRemoteUsers] = useState({});
  const [uid] = useState(Math.floor(Math.random() * 10000));

  useEffect(() => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    joinRoom();

    return () => {
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      leaveRoom();
    };
  }, []);

  async function getAgoraToken(channelName) {
    try {
      const response = await axios.post(`${SERVER_URL}/getToken`, { channelName, uid });
      return response.data.token;
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  }

  async function joinRoom() {
    const token = await getAgoraToken(roomID);
    if (!token) return;

    await client.join(APP_ID, roomID, token, uid);
    setJoined(true);
  }

  async function startStream() {
    const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
    setLocalTracks(tracks);

    const localPlayer = document.createElement("div");
    localPlayer.id = `user-${uid}`;
    localPlayer.className = "video-player";
    document.getElementById("video-container").appendChild(localPlayer);
    tracks[1].play(localPlayer);

    await client.publish(tracks);
    setStreamStarted(true);
  }

  async function handleUserJoined(user, mediaType) {
    await client.subscribe(user, mediaType);
    setRemoteUsers((prevUsers) => ({ ...prevUsers, [user.uid]: user }));

    if (mediaType === "video") {
      const remotePlayer = document.createElement("div");
      remotePlayer.id = `user-${user.uid}`;
      remotePlayer.className = "video-player";
      document.getElementById("video-container").appendChild(remotePlayer);
      user.videoTrack.play(remotePlayer);
    }
  }

  function handleUserLeft(user) {
    document.getElementById(`user-${user.uid}`)?.remove();
    setRemoteUsers((prevUsers) => {
      const newUsers = { ...prevUsers };
      delete newUsers[user.uid];
      return newUsers;
    });
  }

  async function leaveRoom() {
    for (let track of localTracks) {
      track.stop();
      track.close();
    }
    await client.leave();
    setJoined(false);
    setStreamStarted(false);
    setLocalTracks([]);
    document.getElementById("video-container").innerHTML = "";
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {joined ? (
        <>
          <button onClick={leaveRoom}>Leave Room</button>
          {!streamStarted && (
            <button onClick={startStream} style={{ marginLeft: "10px" }}>
              Join Stream
            </button>
          )}
        </>
      ) : (
        <p>Joining room...</p>
      )}
      <div id="video-container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginTop: "20px" }}></div>
    </div>
  );
}

export default VideoCall;
