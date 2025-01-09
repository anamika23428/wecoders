import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Backend URL

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("black"); // Default color
    const [isErasing, setIsErasing] = useState(false); // Erase mode
    const [eraserSize, setEraserSize] = useState(10); // Eraser size

    useEffect(() => {
        // Setup canvas once
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        // Set canvas background color
    ctx.fillStyle = "black"; // Change this to any background color you prefer
    ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctxRef.current = ctx;

        // Handle incoming drawing actions
        socket.on("onpropagate", (action) => {
            draw(action);
        });

        return () => {
            socket.off("onpropagate");
        };
    }, []); // Empty dependency array to ensure this runs only once

const draw = (action) => {
  const ctx = ctxRef.current;

  if (action.type === "start") {
    ctx.beginPath();
    ctx.moveTo(action.x, action.y);
  } else if (action.type === "draw") {
    ctx.strokeStyle = action.color;
    ctx.lineWidth = 2; // Default line width
    ctx.lineTo(action.x, action.y);
    ctx.stroke();
  } else if (action.type === "erase" && isErasing) {
    // Only erase if not already in erase mode
    ctx.strokeStyle = "black";
    ctx.lineWidth = action.size; // Eraser size
    ctx.lineTo(action.x, action.y);
    ctx.stroke();
  }
};
    

    const handleMouseDown = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        setIsDrawing(true);

        const action = isErasing
            ? { type: "erase", x, y, size: eraserSize }
            : { type: "start", x, y };
        draw(action);
        socket.emit("propagate", action);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        const action = isErasing
            ? { type: "erase", x, y, size: eraserSize }
            : { type: "draw", x, y, color };
        draw(action);   
        socket.emit("propagate", action);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    return (
        <div>
            <div style={{ marginBottom: "10px" }}>
                <button
                    onClick={() => {
                        setIsErasing(false);
                        ctxRef.current.lineWidth = 2; // Reset line width for drawing
                    }}
                    style={{ marginRight: "10px" }}
                >
                    Draw
                </button>
                <button
                    onClick={() => {
                        setIsErasing(true);
                        ctxRef.current.lineWidth = eraserSize; // Set eraser size
                    }}
                    style={{ marginRight: "10px" }}
                >
                    Erase
                </button>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    disabled={isErasing}
                />
                <input
                    type="range"
                    min="5"
                    max="50"
                    value={eraserSize}
                    onChange={(e) => setEraserSize(e.target.value)}
                    style={{ marginLeft: "10px" }}
                    disabled={!isErasing}
                />
            </div>
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ border: "1px solid #000", display: "block" }}
            />
        </div>
    );
};

export default Whiteboard;
