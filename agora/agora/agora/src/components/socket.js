import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Use the backend server URL

export default socket; // Export the socket instance
