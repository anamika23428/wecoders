//   const express = require('express');
//   const http = require('http');
//   const { Server } = require('socket.io');
//   const cors = require('cors');

//   const app = express();
//   const server = http.createServer(app);

//   // CORS setup
//   app.use(cors({
//       origin: 'http://localhost:5173',
//       methods: ['GET', 'POST'],
//   }));

//   const io = new Server(server, {
//       cors: {
//           origin: 'http://localhost:5173',
//       }, 
//   });

//   // Shared code state
//   let sharedCode = '// Write your code here...';

//   // Handle socket connections
//   io.on('connection', (socket) => {
//       console.log('New client connected:', socket.id);

//       // Send the current code to the newly connected user
//       socket.emit('codeUpdate', sharedCode);

//       // Listen for code updates from a client
//       socket.on('codeUpdate', (newCode) => {
//           sharedCode = newCode; // Update the shared code
//           io.emit('codeUpdate', sharedCode); // Broadcast to all clients, including sender
//       });

//       // Handle disconnect
//       socket.on('disconnect', () => {
//           console.log('Client disconnected:', socket.id);
//       });
//   });

//   // Start the server
//   const PORT = process.env.PORT || 3000;
//   server.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//   });
// Backend Code
// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// const executeRoute = require('./routes/execute');

// const app = express();
// const server = http.createServer(app);

// // CORS setup
// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST'],
// }));

// const io = new Server(server, {
//     cors: {
//         origin: 'http://localhost:5173',
//     },
// });

// // Shared code state
// let sharedCode = '// Write your code here...';
// let sharedOutput = ''; // Store the shared output

// // Handle socket connections
// io.on('connection', (socket) => {
//     console.log('New client connected:', socket.id);

//     // Send the current code and output to the newly connected user
//     socket.emit('codeUpdate', sharedCode);
//     socket.emit('outputUpdate', sharedOutput);

//     // Listen for code updates from a client
//     socket.on('codeUpdate', (newCode) => {
//         sharedCode = newCode; // Update the shared code
//         io.emit('codeUpdate', sharedCode); // Broadcast to all clients
//     }
    
// );
// socket.on('outputUpdate', (newCode) => {
//     sharedOutput = newCode; // Update the shared code
//     io.emit('outputUpdate', sharedOutput); // Broadcast to all clients
// })
//     // Handle disconnect
//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });
// });


// // Middleware for REST API
// app.use(express.json()); // Parse JSON payloads

// // Route for code execution
// app.use('/execute', executeRoute);

// // Start the server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();

// // Enable CORS
// app.use(
//     cors({
//         origin: "http://localhost:5173", // Your frontend URL
//         methods: ["GET", "POST"],
//     })
// );

// const httpServer = http.createServer(app);
// const io = new Server(httpServer, {
//     cors: {
//         origin: "http://localhost:5173", // Your frontend URL
//         methods: ["GET", "POST"],
//     },
// });

// const connections = new Map();

// io.on("connection", (socket) => {
//     console.log(`${socket.id} connected`);
//     connections.set(socket.id, socket);

//     socket.on("propagate", (data) => {
//         connections.forEach((con, id) => {
//             if (id !== socket.id) {
//                 con.emit("onpropagate", data);
//             }
//         });
//     });

//     socket.on("disconnect", () => {
//         console.log(`${socket.id} disconnected`);
//         connections.delete(socket.id);
//     });
// });

// app.use(express.static("public"));

// const PORT = 3000; // Backend port
// httpServer.listen(PORT, () =>
//     console.log(`Server running on http://localhost:${PORT}`)
// );

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for simplicity
        methods: ['GET', 'POST'],
    },
});

app.use(cors());
app.use(bodyParser.json());

let sharedCode = '// Write your code here...';
let sharedOutput = '';

// Socket.io logic
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the current state of the code to the newly connected client
    socket.emit('codeUpdate', sharedCode);
    socket.emit('outputUpdate', sharedOutput);

    // Listen for code changes from a client
    socket.on('codeUpdate', (updatedCode) => {
        sharedCode = updatedCode;
        socket.broadcast.emit('codeUpdate', updatedCode); // Send to all other clients
    });

    // Listen for output changes
    socket.on('outputUpdate', (updatedOutput) => {
        sharedOutput = updatedOutput;
        socket.broadcast.emit('outputUpdate', updatedOutput); // Send to all other clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// API to execute the code
app.post('/execute', (req, res) => {
    const { code, language, inputData } = req.body;

    // Example response: Here you can add logic to execute the code
    // For now, we'll return a mock response.
    const mockOutput = `Executed code in ${language}:\n${code}\nWith input: ${inputData}`;
    res.json({ output: mockOutput });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

