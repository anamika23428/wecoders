// components/ChatbotComponent.jsx
import React, { useState } from "react";

const ChatbotComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await response.json();
      const botMessage = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server error. Try again." },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700"
      >
        🤖
      </button>

      {isOpen && (
        <div className="w-80 h-96 bg-gray-900 text-white p-4 mt-2 rounded-lg shadow-lg flex flex-col">
          <div className="flex-1 overflow-y-auto border border-gray-700 p-2 rounded mb-2">
            {messages.map((msg, i) => (
              <div key={i} className="mb-1">
                <strong className={msg.sender === "user" ? "text-green-400" : "text-blue-400"}>
                  {msg.sender === "user" ? "You" : "Bot"}:
                </strong>{" "}
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-2 py-1 rounded bg-gray-800 border border-gray-600"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-blue-600 px-3 py-1 rounded">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotComponent;
