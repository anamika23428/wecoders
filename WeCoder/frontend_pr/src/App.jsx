// // import React from 'react';
// // import { BrowserRouter as Router, Route ,Routes } from 'react-router-dom';
// // import Home from './pages/Home';

// // const App = () => {
// //     return (
// //         <Router>
// //            <Routes>
// //            <Route path="/" element={<Home />} />
// //            </Routes>
                
            
// //         </Router>
// //     );
// // };

// // export default App;
// import React, { useState, useEffect } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";

// const APP_ID = "687119f47f8246b389b6b41281c71d79"; // Replace with your Agora App ID
// const TEMP_TOKEN = "007eJxTYOiaEGaqGbPI9fkOLm4bg51TzpQ8e7kow+Nawvfi+l2znV8oMJhZmBsaWqaZmKdZGJmYJRlbWCaZJZkYGlkYJpsbpphbmk4sTm8IZGQ4vIeVhZEBAkF8FobcxMw8BgYAR4gfIg=="; // Replace with your Agora Temporary Token
// const CHANNEL = "main"; // Replace with your channel name

// const App = () => {
//   const [client] = useState(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
//   const [localTracks, setLocalTracks] = useState([]);
//   const [joined, setJoined] = useState(false);

//   useEffect(() => {
//     client.on("user-published", handleUserJoined);
//     client.on("user-unpublished", handleUserLeft);

//     return () => {
//       client.off("user-published", handleUserJoined);
//       client.off("user-unpublished", handleUserLeft);
//     };
//   }, [client]);

//   const joinStream = async () => {
//     if (client.connectionState !== "DISCONNECTED") {
//       console.error("Client is already connecting or connected.");
//       return;
//     }

//     try {
//       const UID = await client.join(APP_ID, CHANNEL, TEMP_TOKEN, null);
//       console.log("Joined channel with UID:", UID);

//       const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
//       setLocalTracks(tracks);

//       const videoContainer = document.getElementById("video-streams");
//       if (!videoContainer) {
//         throw new Error("'video-streams' container is not found in the DOM.");
//       }

//       const player = createPlayer(UID);
//       videoContainer.appendChild(player);

//       tracks[1].play(`user-${UID}`); // Play the local video track
//       console.log("Local video track played for UID:", UID);

//       await client.publish(tracks); // Publish the tracks
//       console.log("Local tracks published.");

//       setJoined(true);
//     } catch (error) {
//       console.error("Error joining stream:", error);
//     }
//   };

//   const leaveStream = async () => {
//     try {
//       localTracks.forEach((track) => {
//         track.stop();
//         track.close();
//       });

//       await client.leave();
//       setLocalTracks([]);
//       setJoined(false);

//       const videoContainer = document.getElementById("video-streams");
//       if (videoContainer) videoContainer.innerHTML = "";

//       console.log("Left the stream.");
//     } catch (error) {
//       console.error("Error leaving stream:", error);
//     }
//   };

//   const handleUserJoined = async (user, mediaType) => {
//     try {
//       await client.subscribe(user, mediaType);
//       console.log("User subscribed:", user);

//       if (mediaType === "video") {
//         let player = document.getElementById(`user-container-${user.uid}`);
//         if (!player) {
//           player = createPlayer(user.uid);
//           document.getElementById("video-streams").appendChild(player);
//         }
//         user.videoTrack.play(`user-${user.uid}`);
//         console.log("Playing video for user:", user.uid);
//       }

//       if (mediaType === "audio") {
//         user.audioTrack.play();
//         console.log("Playing audio for user:", user.uid);
//       }
//     } catch (error) {
//       console.error("Error handling user joined:", error);
//     }
//   };

//   const handleUserLeft = (user) => {
//     console.log("User left:", user.uid);
//     const player = document.getElementById(`user-container-${user.uid}`);
//     if (player) player.remove();
//   };

//   const createPlayer = (uid) => {
//     const player = document.createElement("div");
//     player.className = "video-container border rounded shadow-md p-2 bg-white";
//     player.id = `user-container-${uid}`;
//     player.innerHTML = `
//       <div class="video-player w-full h-64" id="user-${uid}"></div>
//     `;
//     return player;
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       {!joined ? (
//         <button
//           className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//           onClick={joinStream}
//         >
//           Join Stream
//         </button>
//       ) : (
//         <div className="space-x-4">
//           <button
//             className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
//             onClick={leaveStream}
//           >
//             Leave Stream
//           </button>
//         </div>
//       )}
//       <div
//         id="video-streams"
//         className="grid grid-cols-2 gap-4 mt-6 w-full max-w-4xl"
//       ></div>
//     </div>
//   );
// };

// export default App;
// App.jsx
// import React, { useState, useEffect } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";
// import { FaDesktop, FaStop } from "react-icons/fa";

// const APP_ID = "687119f47f8246b389b6b41281c71d79"; // Replace with your Agora App ID
// const TEMP_TOKEN = "007eJxTYDiTt7JiRln/8m92/06lKr54ENdkqp7esUM2x7TnJesMDgEFBjMLc0NDyzQT8zQLIxOzJGMLyySzJBNDIwvDZHPDFHPL7i3l6Q2BjAzuK84wMjJAIIjPwpCbmJnHwAAAVEsfCQ=="; // Replace with your Agora Temporary Token
// const CHANNEL = "main"; // Replace with your channel name

// const App = () => {
//   const [client] = useState(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
//   const [screenTrack, setScreenTrack] = useState(null);
//   const [joined, setJoined] = useState(false);
//   const [screenSharing, setScreenSharing] = useState(false);

//   useEffect(() => {
//     client.on("user-published", handleUserPublished);
//     client.on("user-unpublished", handleUserUnpublished);

//     return () => {
//       client.off("user-published", handleUserPublished);
//       client.off("user-unpublished", handleUserUnpublished);
//     };
//   }, [client]);

//   const joinStream = async () => {
//     try {
//       const UID = await client.join(APP_ID, CHANNEL, TEMP_TOKEN, null);
//       console.log("Joined channel with UID:", UID);
//       setJoined(true);
//     } catch (error) {
//       console.error("Error joining stream:", error);
//     }
//   };

//   const leaveStream = async () => {
//     try {
//       if (screenTrack) {
//         await stopScreenSharing();
//       }
//       await client.leave();
//       setJoined(false);
//       console.log("Left the stream.");
//     } catch (error) {
//       console.error("Error leaving stream:", error);
//     }
//   };

//   const startScreenSharing = async () => {
//     try {
//       const track = await AgoraRTC.createScreenVideoTrack();
//       setScreenTrack(track);

//       const videoContainer = document.getElementById("screen-share-container");
//       if (!videoContainer) throw new Error("'screen-share-container' not found in the DOM");

//       const player = createPlayer("screen");
//       videoContainer.appendChild(player);

//       track.play(`user-screen`);
//       await client.publish(track);
//       console.log("Screen sharing started.");
//       setScreenSharing(true);
//     } catch (error) {
//       console.error("Error starting screen sharing:", error);
//     }
//   };

//   const stopScreenSharing = async () => {
//     try {
//       if (screenTrack) {
//         await client.unpublish(screenTrack);
//         screenTrack.stop();
//         screenTrack.close();
//         setScreenTrack(null);
//       }
//       setScreenSharing(false);
//       console.log("Screen sharing stopped.");
//     } catch (error) {
//       console.error("Error stopping screen sharing:", error);
//     }
//   };

//   const handleUserPublished = async (user, mediaType) => {
//     try {
//       await client.subscribe(user, mediaType);
//       console.log("User subscribed:", user);

//       if (mediaType === "video") {
//         let player = document.getElementById(`user-container-${user.uid}`);
//         if (!player) {
//           player = createPlayer(user.uid);
//           document.getElementById("screen-share-container").appendChild(player);
//         }
//         user.videoTrack.play(`user-${user.uid}`);
//         console.log("Playing video for user:", user.uid);
//       }
//     } catch (error) {
//       console.error("Error handling user published:", error);
//     }
//   };

//   const handleUserUnpublished = (user) => {
//     console.log("User unpublished:", user.uid);
//     const player = document.getElementById(`user-container-${user.uid}`);
//     if (player) player.remove();
//   };

//   const createPlayer = (uid) => {
//     const player = document.createElement("div");
//     player.className = "video-container border rounded shadow-md p-2 bg-white";
//     player.id = `user-container-${uid}`;
//     player.innerHTML = `
//       <div class="video-player w-full h-64" id="user-${uid}"></div>
//     `;
//     return player;
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
//       {!joined ? (
//         <button
//           className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//           onClick={joinStream}
//         >
//           Join Stream
//         </button>
//       ) : (
//         <div className="space-x-4">
//           <button
//             className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
//             onClick={leaveStream}
//           >
//             Leave Stream
//           </button>
//           {!screenSharing ? (
//             <button
//               className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
//               onClick={startScreenSharing}
//             >
//               <FaDesktop className="inline-block mr-2" /> Start Screen Sharing
//             </button>
//           ) : (
//             <button
//               className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
//               onClick={stopScreenSharing}
//             >
//               <FaStop className="inline-block mr-2" /> Stop Screen Sharing
//             </button>
//           )}
//         </div>
//       )}
//       <div
//         id="screen-share-container"
//         className="grid grid-cols-2 gap-4 mt-6 w-full max-w-4xl"
//       ></div>
//     </div>
//   );
// };

// export default App;
import React, { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const App = () => {
  const [client] = useState(() => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [localScreenTrack, setLocalScreenTrack] = useState(null);
  const [joined, setJoined] = useState(false);

const APP_ID = "687119f47f8246b389b6b41281c71d79"; // Replace with your Agora App ID
const TEMP_TOKEN = "007eJxTYDiTt7JiRln/8m92/06lKr54ENdkqp7esUM2x7TnJesMDgEFBjMLc0NDyzQT8zQLIxOzJGMLyySzJBNDIwvDZHPDFHPL7i3l6Q2BjAzuK84wMjJAIIjPwpCbmJnHwAAAVEsfCQ=="; // Replace with your Agora Temporary Token
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

export default App;
