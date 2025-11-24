import React, { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

import ApplyLeave from "./ApplyLeave";
import LeaveHistory from "./LeaveHistory";
import HolidayList   from "./HolidayList";

export default function Dashboard() {
  const navigate = useNavigate();
  const auth = useAuthStore((s) => s.auth);
  const logout = useAuthStore((s) => s.logout);

  const [activeTab, setActiveTab] = useState("apply");

  useEffect(() => {
    if (!auth) navigate("/");
  }, [auth]);

  return (
    <div className="dashboard-container">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="navbar-left">
          <h2>Leave Tracker</h2>
        </div>

        <div className="navbar-right">
          <span className="user-text">
            {auth?.sub || auth?.username} ({auth?.role})
          </span>

          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* LEFT MAIN BOX */}
        <div className="left-panel">
          {/* TABS */}
          <div className="tabs">
            <button
              className={activeTab === "apply" ? "tab active" : "tab"}
              onClick={() => setActiveTab("apply")}
            >
              Apply Leave
            </button>

            <button
              className={activeTab === "history" ? "tab active" : "tab"}
              onClick={() => setActiveTab("history")}
            >
              Leave History
            </button>

            <button
              className={activeTab === "holidays" ? "tab active" : "tab"}
              onClick={() => setActiveTab("holidays")}
            >
              Holidays
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="tab-content">
            {activeTab === "apply" && <ApplyLeave />}
            {activeTab === "history" && <LeaveHistory />}
            {activeTab === "holidays" && <HolidayList holidays={[]} />}
          </div>
        </div>

        {/* RIGHT SIDE PANEL */}
        <div className="right-panel">
          <h3>Pending Leaves</h3>
          <p>No pending approvals yet.</p>
        </div>
      </div>
    </div>
  );
}
