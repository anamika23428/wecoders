import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const Chat = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const socketRef = useRef(null);
  const { roomId } = useParams(); // Ensure correct key name

  // Fetch username from sessionStorage (or pass it as a prop from Room)
  const userName = sessionStorage.getItem("userName");

  // Initialize socket connection
  useEffect(() => {
    const socket = io("http://localhost:5000"); // Change to your backend URL
    socketRef.current = socket;

    socket.emit("join-room", { roomId, userName });

    return () => {
      socket.disconnect();
    };
  }, [userName, roomId]); // Correct dependency names

  // Listen for messages
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("message", handleMessage);
    return () => socket.off("message", handleMessage);
  }, []);

  // Listen for room users
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleRoomUsers = ({ users }) => {
      setUsers(users);
    };

    socket.on("roomusers", handleRoomUsers);
    return () => socket.off("roomusers", handleRoomUsers);
  }, []);

  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socketRef.current.emit("chatMessage", { userName, text: message  });
      setMessage("");
    }
  };

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-gray-900 text-white shadow-xl flex flex-col border-l border-gray-700">
      {/* Chat Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Chat Room: {roomId}</h2>
        <button
          onClick={onClose}
          className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
        >
          ×
        </button>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-3 bg-gray-800">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">No messages yet...</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="p-3 rounded-lg bg-gray-700 shadow">
              <p className="text-sm font-semibold text-green-400">{msg.userName}</p>
              <p className="mt-1 text-white">{msg.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Chat Input */}
      <div className="p-3 bg-gray-800 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;