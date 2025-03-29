import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // ✅ Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toastify CSS
import Home from "./components/Home";
import Room from "./components/Room";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} /> {/* ✅ ToastContainer properly placed */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId/:userName" element={<Room />} /> 
      </Routes>
    </Router>
  );
}

export default App;
