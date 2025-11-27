import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import "../styles/dashboard.css";

import ApplyLeave from "./ApplyLeave";
import LeaveHistory from "./LeaveHistory";
import EmployeeHolidayList from "./EmployeeHolidayList";

export default function Dashboard() {
  const navigate = useNavigate();
  const auth = useAuthStore((s) => s.auth);
  const logout = useAuthStore((s) => s.logout);

  const [activeTab, setActiveTab] = useState("apply");
  const [holidays, setHolidays] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingHolidays, setLoadingHolidays] = useState(true);

  // Fetch leave history for both LeaveHistory tab and pending leaves
  const fetchLeaveHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch("http://localhost:8081/leave/history", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch leave history");

      const data = await res.json();
      setLeaveHistory(data);
    } catch (err) {
      console.error("Leave history fetch error →", err);
      setLeaveHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Fetch holidays for Holidays tab
  const fetchHolidays = async () => {
    try {
      setLoadingHolidays(true);
      const res = await fetch("http://localhost:8083/holidays", {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch holidays");

      const data = await res.json();
      setHolidays(data);
    } catch (err) {
      console.error("Holiday fetch error →", err);
      setHolidays([]);
    } finally {
      setLoadingHolidays(false);
    }
  };

  useEffect(() => {
    if (!auth) navigate("/");

    fetchLeaveHistory();

    // Fetch holidays only when the Holidays tab is active
    if (activeTab === "holidays") fetchHolidays();
  }, [auth, activeTab]);

  // Filter pending leaves from history
  const pendingLeaves = leaveHistory.filter((l) => l.status === "PENDING");

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
        {/* LEFT PANEL */}
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
            {activeTab === "holidays" &&
              (loadingHolidays ? (
                <p>Loading holidays...</p>
              ) : (
                <EmployeeHolidayList holidays={holidays} />
              ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        {/* RIGHT PANEL */}
<div className="right-panel">
  <h3>Pending Leaves</h3>
  {loadingHistory ? (
    <p>Loading pending leaves...</p>
  ) : pendingLeaves.length === 0 ? (
    <p>No pending approvals yet.</p>
  ) : (
    <ul className="pending-list">
      {pendingLeaves.map((leave) => (
        <li key={leave.id} className="pending-item">
          {leave.reason}
        </li>
      ))}
    </ul>
  )}
</div>

      </div>
    </div>
  );
}
