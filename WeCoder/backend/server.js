const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const executeRouter = require("./routes/execute");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Adjust to match your client-side address
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());

const rooms = {}; // For code collaboration
const drawingRooms = {}; // For drawing collaboration

// Route to create a new room
app.post("/create-room", (req, res) => {
  const roomId = uuidv4();
  rooms[roomId] = ""; // Initialize room state for code
  drawingRooms[roomId] = []; // Initialize room state for drawing
  console.log(`Room created: ${roomId}`);
  res.json({ roomId });
});

// Socket.io logic for collaboration
io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Join room
  socket.on("join-room", (roomId) => {
    console.log(`User ${socket.id} joined room: ${roomId}`);

    // Initialize room state if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = ""; // Initialize the room with empty code
    }
    if (!drawingRooms[roomId]) {
      drawingRooms[roomId] = []; // Initialize the room with empty drawing actions
    }

    socket.join(roomId);

    // Send the current state of the room's code to the new client
    socket.emit("code-update", rooms[roomId]);

    // Send the current drawing state to the new client
    socket.emit("drawing-update", drawingRooms[roomId]);
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
  socket.on("code-change", ({ roomId, code }) => {
    console.log(`Code change in room ${roomId}: ${code}`);
    rooms[roomId] = code;

    // Broadcast updated code to all clients in the room except sender
    socket.to(roomId).emit("code-update", code);
  });

  // Handle output changes
  socket.on("output-change", ({ roomId, output }) => {
    console.log(`Output change in room ${roomId}: ${output}`);
    socket.to(roomId).emit("output-update", output);
  });
  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

// API to execute code
app.use("/execute", executeRouter);

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});