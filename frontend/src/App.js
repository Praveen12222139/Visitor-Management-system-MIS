import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import BookAppointment from "./pages/BookAppointment";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login.js";
import Register from "./pages/Register";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<BookAppointment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
