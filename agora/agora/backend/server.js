  require("dotenv").config();
  const express = require("express");
  const cors = require("cors");
  const { v4: uuidv4 } = require("uuid");
  const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
  const http = require("http");
  const { Server } = require("socket.io");
  const bodyParser = require("body-parser");
  const executeRouter = require("./routes/execute");
  const formatMessage = require("./utils/messages");
  const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users");

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(bodyParser.json());

  const PORT = process.env.PORT || 5000;
  const APP_ID = process.env.APP_ID;
  const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
  const botname = "ChatBot";

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Adjust as per client URL
      methods: ["GET", "POST"],
    },
  });

  const rooms = {}; // Store code editor state by room ID
  const drawingRooms = {}; // Store drawing actions by room ID

  // API to execute code
  app.use("/execute", executeRouter);

  // Route to create a new room
  app.post("/create-room", (req, res) => {
    const { userName } = req.body;
    if (!userName) {
      return res.status(400).json({ error: "Username is required" });
    }

    const roomId = uuidv4(); // Generate unique Room ID
    console.log(`Room created: ${roomId} by ${userName}`);

    res.json({ roomId, userName });
  });

  // Route to generate Agora token
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

  // Socket.io logic for real-time collaboration
  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);
  
    // Handle room join
    socket.on("join-room", (data) => {
      console.log("Received join-room data:", data); 
      const { roomId, userName } = data;
      if (!userName || !roomId) {
        console.error('Username and room are required');
        return;
      }

      // Join the room
      const user = userJoin(socket.id, userName, roomId);
      if (!user) {
        console.error('Failed to join room');
        return;
      }
      socket.join(user.room);

      if (!roomId) {
        console.error(`Invalid room ID provided by user ${socket.id}`);
        socket.emit("error", { message: "Invalid room ID" });
        return;
      }

      console.log(`User ${userName} (${socket.id}) joined room: ${roomId}`);

      // Initialize room state if it doesn't exist
      if (!rooms[roomId]) {
        rooms[roomId] = "";
      }
      if (!drawingRooms[roomId]) {
        drawingRooms[roomId] = [];
      }

      // Join the room
    

      // Send the current state of the room's code to the new user
      socket.emit("code-update", rooms[roomId]); // Send only to the joining user

      // Replay all previous drawing actions for the new user
      drawingRooms[roomId].forEach((action) => {
        socket.emit("onpropagate", { room: roomId , action }); // Send only to the joining user
      });

      // Manage chat users
      // const user = userJoin(socket.id, roomId, userName);
      console.log(user);

      // Welcome the user
      socket.emit("message", formatMessage(botname, "Welcome to ChatChord!"));

      // Notify others in the room
      socket.broadcast.to(roomId).emit("message", formatMessage(botname, `${user.username} has joined the chat`));

      // Update room users
      io.to(roomId).emit("roomusers", {
        room: roomId,
        users: getRoomUsers(roomId),
      });
    });

    // Handle drawing actions (propagate drawing action to all clients, including sender)
    socket.on("propagate", ({ room, action }) => {
      console.log(`Drawing action in room ${room}:`, action);

      if (!drawingRooms[room]) {
        drawingRooms[room] = [];
      }
      drawingRooms[room].push(action);

      io.to(room).emit("onpropagate", { room, action }); // Broadcast to all including sender
    });

    // Handle code changes (broadcast code to all clients, including sender)
    socket.on("code-change", ({ roomId, code }) => {
      console.log(`Code change in room ${roomId}: ${code}`);
      rooms[roomId] = code;

      io.to(roomId).emit("code-update", code); // Broadcast to all including sender
    });

    // Handle output changes (broadcast output to all clients, including sender)
    socket.on("output-change", ({ roomId, output }) => {
      console.log(`Output change in room ${roomId}: ${output}`);
      io.to(roomId).emit("output-update", output); // Broadcast to all including sender
    });

    // Handle chat messages
    socket.on("chatMessage", (msg ) => {
      const user = getCurrentUser(socket.id);
      console.log('curr user',user);
      if (user) {
        console.log(`Message from ${user.username}: ${msg.text}`);
    
        // Broadcast the message to the room
        io.to(user.room).emit("message", {
          userName: user.username, // Use the username from the user object
          text: msg.text, // Use the message text from the msg object
        });
      } else {
        console.error("User not found");
      }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
      if (user) {
        console.log(`${user.username} disconnected from room: ${user.room}`);

        // Notify others that user has left
        io.to(user.room).emit("message", formatMessage(botname, `${user.username} has left the chat`));

        // Update room users
        io.to(user.room).emit("roomusers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });

  // Start the server
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
