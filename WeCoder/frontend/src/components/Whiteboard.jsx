import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
const socket = io("http://localhost:3000"); // Backend URL

const Whiteboard = () => {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("black"); // Default color
    const [isErasing, setIsErasing] = useState(false); // Erase mode
    const [eraserSize, setEraserSize] = useState(10); // Eraser size
    const { roomId } = useParams();

    useEffect(() => {
        // Setup canvas
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");

        // Set canvas background color
        ctx.fillStyle = "white"; // Background color
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctxRef.current = ctx;

        // Join the room
        socket.emit("join-room", roomId);

        // Listen for drawing actions
        socket.on("onpropagate", ({ room, action }) => {
            if (room === roomId) {
                draw(action);
            }
        });

        return () => {
            socket.emit("leave-room", roomId);
            socket.off("onpropagate");
        };
    }, [roomId]);

    const draw = (action) => {
        const ctx = ctxRef.current;

        if (action.type === "start") {
            ctx.beginPath();
            ctx.moveTo(action.x, action.y);
        } else if (action.type === "draw") {
            ctx.strokeStyle = action.color;
            ctx.lineWidth = 2;
            ctx.lineTo(action.x, action.y);
            ctx.stroke();
        } else if (action.type === "erase") {
            ctx.strokeStyle = "white";
            ctx.lineWidth = action.size;
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
        socket.emit("propagate", { room: roomId, action });
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
        socket.emit("propagate", { room: roomId, action });
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen p-3">
        <div className="mb-2 flex items-center justify-center">
            <button
                onClick={() => {
                    setIsErasing(false);
                    ctxRef.current.lineWidth = 2;
                }}
                className="button mr-2 "
            >
                Draw
            </button>
            <button
                onClick={() => {
                    setIsErasing(true);
                    ctxRef.current.lineWidth = eraserSize;
                }}
                className="button mr-2"
            >
                Erase
            </button>
            <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={isErasing}
                className="mr-2"
            />
           <div className="flex items-center">
    <label className="mr-1 text-md">Eraser Size :</label>
    <input
        type="range"
        id="eraserSize"
        min="5"
        max="50"
        value={eraserSize}
        onChange={(e) => setEraserSize(e.target.value)}
        className="ml-1"
        disabled={!isErasing}
    />
</div>

        </div>
        <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="border border-black block w-full h-full box-border"
        />
    </div>
    
    
    );
};

export default Whiteboard;
