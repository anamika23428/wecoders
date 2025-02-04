// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { v4: uuidv4 } = require("uuid");
// const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const APP_ID = process.env.APP_ID;
// const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
// const PORT = process.env.PORT || 5000;

// // Route to create a new room
// app.post("/create-room", (req, res) => {
//     const roomId = uuidv4();
//     console.log(`Room created: ${roomId}`);
//     res.json({ roomId });
//   });

// app.post('/getToken', (req, res) => {
//     const { channelName, uid } = req.body;

//     if (!channelName || !uid) {
//         return res.status(400).json({ error: "Channel name and UID are required" });
//     }

//     const role = RtcRole.PUBLISHER;
//     const expirationTimeInSeconds = 3600; // Token valid for 1 hour
//     const currentTimestamp = Math.floor(Date.now() / 1000);
//     const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

//     const token = RtcTokenBuilder.buildTokenWithUid(
//         APP_ID, APP_CERTIFICATE, channelName, parseInt(uid), role, privilegeExpiredTs
//     );

//     res.json({ token });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const executeRouter = require("./routes/execute");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust to match your client-side address
    methods: ["GET", "POST"],
  },
});

const rooms = {}; // Store code editor state by room ID
const drawingRooms = {}; // Store drawing actions by room ID

// API to execute code
app.use("/execute", executeRouter);

// Route to create a new room
app.post("/create-room", (req, res) => {
  const roomId = uuidv4();
  console.log(`Room created: ${roomId}`);
  res.json({ roomId });
});

app.post("/getToken", (req, res) => {
  const { channelName, uid } = req.body;

  if (!channelName || !uid) {
    return res.status(400).json({ error: "Channel name and UID are required" });
  }

  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600; // Token valid for 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    parseInt(uid),
    role,
    privilegeExpiredTs
  );

  res.json({ token });
});

// Socket.io logic for collaboration
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Handle room join
  socket.on("join-room", (data) => {
    console.log("data", data);
    if (!data.roomId) {
      console.error(`Invalid room ID provided by user ${data.id}`);
      socket.emit("error", { message: "Invalid room ID" });
      return;
    }

    console.log(`User ${data.id} joined room: ${data.roomId}`);

    // Initialize room state if it doesn't exist
    if (!rooms[data.roomId]) {
      rooms[data.roomId] = "";
    }
    if (!drawingRooms[data.roomId]) {
      drawingRooms[data.roomId] = [];
    }

    // Join the room
    socket.join(data.roomId);

    // Send the current state of the room's code and drawing actions to the new client
    socket.emit("code-update", rooms[data.roomId]);
    socket.emit("drawing-update", drawingRooms[data.roomId]);
  });

  // Handle drawing actions (propagate drawing action to all clients)
  socket.on("propagate", ({ room, action }) => {
    console.log(`Drawing action in room ${room}:`, action);

    // Update the drawing room state
    if (!drawingRooms[room]) {
      drawingRooms[room] = [];
    }
    drawingRooms[room].push(action);

    // Broadcast the drawing action to all clients in the room except sender
    socket.to(room).emit("onpropagate", { room, action });
  });

  // Handle code changes (broadcast code to all clients)
  socket.on("code-change", ({ roomId, code }) => {
    console.log(`Code change in room ${roomId}: ${code}`);
    rooms[roomId] = code;

    // Broadcast updated code to all clients in the room except sender
    socket.to(roomId).emit("code-update", code);
  });

  // Handle output changes (broadcast output to all clients)
  socket.on("output-change", ({ roomId, output }) => {
    console.log(`Output change in room ${roomId}: ${output}`);
    socket.to(roomId).emit("output-update", output);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
