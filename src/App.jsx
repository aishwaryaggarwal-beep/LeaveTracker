import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx"; 
import useAuthStore from "./store/authStore.js";
import ApplyLeave from "./pages/ApplyLeave.jsx";
import LeaveHistory from "./pages/LeaveHistory.jsx";
import ManagerDashboard from "./pages/ManagerDashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  const auth = useAuthStore((state) => state.auth);

  return (
    
    <Router>
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/apply" element={<ApplyLeave />} />
        <Route path="/history" element={<LeaveHistory />} />
        <Route path="/manager" element={<ManagerDashboard />} />
         <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["USER", "MANAGER", "ADMIN"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );

}

export default App;


