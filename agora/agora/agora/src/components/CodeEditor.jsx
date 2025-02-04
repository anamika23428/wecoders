import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const CodeEditor = () => {
  const { roomId } = useParams();
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("python");
  const [inputData, setInputData] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Connect to the room when component mounts
    socket.emit("join-room", { roomId });

    // Listen for code updates from the server
    socket.on("code-update", (updatedCode) => {
      setCode(updatedCode);
    });

    // Listen for output updates from the server
    socket.on("output-update", (updatedOutput) => {
      setOutput(updatedOutput);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Cleanup on component unmount
    return () => {
      socket.off("code-update");
      socket.off("output-update");
      socket.off("disconnect");
    };
  }, [roomId]);

  const handleCodeChange = (event) => {
    const newCode = event.target.value;
    setCode(newCode);
    // Emit code changes to the server for other users to receive
    socket.emit("code-change", { roomId, code: newCode });
  };

  const handleInputChange = (event) => {
    setInputData(event.target.value);
  };

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
      // Emit the output update to all users in the room
      socket.emit("output-change", { roomId, output: result });
    } catch (error) {
      const errorMsg = "Error while executing code.";
      setOutput(errorMsg);
      socket.emit("output-change", { roomId, output: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <header className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Room: {roomId}</h1>
        <div className="flex items-center mt-4 space-x-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2 border rounded-md focus:ring focus:ring-indigo-500"
          >
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          <button
            onClick={handleRunCode}
            disabled={loading}
            className={`px-4 py-2 text-white font-bold rounded-md ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>
      </header>

      <div className="w-full max-w-4xl">
        <textarea
          value={code}
          onChange={handleCodeChange}
          rows={20}
          className="w-full p-4 text-sm font-mono bg-white border rounded-md shadow-sm focus:ring focus:ring-indigo-500"
        />
      </div>

      {/* Input Column for user input */}
      <div className="mt-6 w-full max-w-4xl bg-white p-4 rounded-md shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Input:</h2>
        <textarea
          value={inputData}
          onChange={handleInputChange}
          rows={6}
          className="w-full p-4 text-sm font-mono bg-white border rounded-md shadow-sm focus:ring focus:ring-indigo-500"
          placeholder="Enter input for your code..."
        />
      </div>

      <div className="mt-6 w-full max-w-4xl bg-white p-4 rounded-md shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Output:</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
