import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const CodeEditor = () => {
  const { roomId ,userName } = useParams();
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("python");
  const [inputData, setInputData] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.emit("join-room", {  roomId , userName});

    socket.on("code-update", (updatedCode) => setCode(updatedCode));
    socket.on("output-update", (updatedOutput) => setOutput(updatedOutput));

    socket.on("disconnect", () => console.log("Disconnected from server"));

    return () => {
      socket.off("code-update");
      socket.off("output-update");
      socket.off("disconnect");
    };
  }, [roomId]);

  const handleCodeChange = (event) => {
    const newCode = event.target.value;
    setCode(newCode);
    socket.emit("code-change", { roomId, code: newCode });
  };

  const handleInputChange = (event) => setInputData(event.target.value);

  const handleRunCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/execute", {
        code,
        language,
        inputData,
      });
      const result = response.data.output || response.data.error;
      setOutput(result);
      socket.emit("output-change", { roomId, output: result });
    } catch (error) {
      setOutput("Error while executing code.");
      socket.emit("output-change", { roomId, output: "Error while executing code." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 flex flex-col items-center p-6">
      {/* Room Header */}
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold text-white">Room: {roomId}</h1>
        <div className="flex items-center mt-4 space-x-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2 bg-[#1E1E1E] text-white border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="python">🐍 Python</option>
            <option value="cpp">💻 C++</option>
            <option value="java">☕ Java</option>
          </select>
          <button
            onClick={handleRunCode}
            disabled={loading}
            className={`px-4 py-2 text-white font-bold rounded-md transition-all ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg"
            }`}
          >
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>
      </header>

      {/* Code Editor */}
      <div className="w-full max-w-4xl">
        <textarea
          value={code}
          onChange={handleCodeChange}
          rows={15}
          className="w-full p-4 text-sm font-mono bg-[#1E1E1E] text-white border border-gray-600 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Input Section */}
      <div className="mt-6 w-full max-w-4xl bg-[#1E1E1E] p-4 rounded-md shadow-lg border border-gray-600">
        <h2 className="text-xl font-semibold text-white mb-2">Input:</h2>
        <textarea
          value={inputData}
          onChange={handleInputChange}
          rows={4}
          className="w-full p-3 text-sm font-mono bg-[#282828] text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter input for your code..."
        />
      </div>

      {/* Output Section */}
      <div className="mt-6 w-full max-w-4xl bg-[#1E1E1E] p-4 rounded-md shadow-lg border border-gray-600">
        <h2 className="text-xl font-semibold text-white mb-2">Output:</h2>
        <pre className="bg-[#282828] p-4 rounded-md text-white border border-gray-600 overflow-auto">{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
