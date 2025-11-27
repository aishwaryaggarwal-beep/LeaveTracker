import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import ApplyLeave from "./ApplyLeave";
import LeaveHistory from "./LeaveHistory";
import EmployeeHolidayList from "./EmployeeHolidayList";
import "../styles/managerDashboard.css";
import ManagerPendingRequests from "./ManagerPendingRequests";

// ManagerDashboard.jsx
// Put this file in your components folder. Create ../styles/managerDashboard.css and paste the CSS from the bottom of this file.

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const auth = useAuthStore((s) => s.auth);
  const logout = useAuthStore((s) => s.logout);

  const [activeTab, setActiveTab] = useState("dashboard");

  // Data
  const [teamLeaves, setTeamLeaves] = useState([]); // all team leaves
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [leaveHistory, setLeaveHistory] = useState([]); // manager's own history or team history
  const [holidays, setHolidays] = useState([]);

  // small UI state
  const [actionLoading, setActionLoading] = useState(false);

  // fetch team leaves (pending + all) - endpoint assumed
  const fetchTeamLeaves = async () => {
    try {
      setLoadingTeam(true);
      const res = await fetch("http://localhost:8081/leave/team", {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });

      if (!res.ok) {
        // fallback: try fetching all history and filter by managerId (best-effort)
        console.warn("/leave/team not available, falling back to /leave/history");
        await fetchLeaveHistory();
        setLoadingTeam(false);
        return;
      }

      const data = await res.json();
      setTeamLeaves(data);
    } catch (err) {
      console.error("Team leaves fetch error →", err);
    } finally {
      setLoadingTeam(false);
    }
  };

  // fetch leave history (manager's own view)
  const fetchLeaveHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await fetch("http://localhost:8081/leave/history", {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch leave history");
      const data = await res.json();
      setLeaveHistory(data);

      // if teamLeaves empty (fallback), derive manager's team pending from history
      if (teamLeaves.length === 0) {
        // try to infer team leaves: picks leaves whose managerId matches current manager id
        const inferred = data.filter((l) => l.managerId === auth?.id || l.reviewerId === auth?.id || l.toManager === true);
        if (inferred.length > 0) setTeamLeaves(inferred);
      }
    } catch (err) {
      console.error("Leave history fetch error →", err);
      setLeaveHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // fetch holidays
  const fetchHolidays = async () => {
    try {
      const res = await fetch("http://localhost:8083/holidays", {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch holidays");
      const data = await res.json();
      setHolidays(data);
    } catch (err) {
      console.error("Holiday fetch error →", err);
      setHolidays([]);
    }
  };

  useEffect(() => {
    if (!auth) navigate("/");

    // on mount fetch the data manager needs
    fetchLeaveHistory();
    fetchTeamLeaves();
    fetchHolidays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  // Approve / Reject handlers
  // These assume your backend exposes endpoints like PUT /leave/{id}/approve and /leave/{id}/reject
  const handleApprove = async (leaveId) => {
    try {
      setActionLoading(true);
      const res = await fetch(`http://localhost:8081/leave/${leaveId}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${auth?.token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Approve failed");
      // optimistic update: remove approved from teamLeaves
      setTeamLeaves((prev) => prev.filter((l) => l.id !== leaveId));
      await fetchLeaveHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to approve leave. Check console for details.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (leaveId) => {
    try {
      setActionLoading(true);
      const res = await fetch(`http://localhost:8081/leave/${leaveId}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${auth?.token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Reject failed");
      setTeamLeaves((prev) => prev.filter((l) => l.id !== leaveId));
      await fetchLeaveHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to reject leave. Check console for details.");
    } finally {
      setActionLoading(false);
    }
  };

  // derived lists
  const pendingRequests = teamLeaves.filter((l) => l.status === "PENDING");
  const approvedRequests = teamLeaves.filter((l) => l.status === "APPROVED");

  return (
    <div className="manager-dashboard">
      <header className="manager-navbar">
        <div className="left">
          <h2>Manager Dashboard</h2>
        </div>
        <div className="right">
          <div className="user">{auth?.sub || auth?.username} ({auth?.role})</div>
          <button className="logout" onClick={() => { logout(); navigate('/'); }}>Logout</button>
        </div>
      </header>

      <div className="manager-content">
        <aside className="mgr-sidebar">
          <button className={activeTab === 'dashboard' ? 'side-btn active' : 'side-btn'} onClick={() => setActiveTab('dashboard')}>Overview</button>
          <button className={activeTab === 'pending' ? 'side-btn active' : 'side-btn'} onClick={() => setActiveTab('pending')}>Pending Approvals</button>
          <button className={activeTab === 'team-history' ? 'side-btn active' : 'side-btn'} onClick={() => setActiveTab('team-history')}>Team History</button>
          <button className={activeTab === 'calendar' ? 'side-btn active' : 'side-btn'} onClick={() => setActiveTab('calendar')}>Team Calendar</button>
          <button className={activeTab === 'apply' ? 'side-btn active' : 'side-btn'} onClick={() => setActiveTab('apply')}>Apply Leave</button>
          <button className={activeTab === 'holidays' ? 'side-btn active' : 'side-btn'} onClick={() => setActiveTab('holidays')}>Holidays</button>
          <button className={activeTab === 'profile' ? 'side-btn active' : 'side-btn'} onClick={() => setActiveTab('profile')}>Profile</button>
        </aside>

        <main className="mgr-main">
          {activeTab === 'dashboard' && (
            <div className="overview-cards">
              <div className="card">
                <h4>Pending</h4>
                <p className="big">{pendingRequests.length}</p>
              </div>
              <div className="card">
                <h4>On Leave Today</h4>
                <p className="big">{teamLeaves.filter(l => isToday(l.startDate)).length}</p>
              </div>
              <div className="card">
                <h4>Total Team Requests</h4>
                <p className="big">{teamLeaves.length}</p>
              </div>
            </div>
          )}
{/* 
          {activeTab === 'pending' && (
            <section className="pending-section">
              <h3>Pending Approvals</h3>
              {loadingTeam ? (
                <p>Loading pending requests...</p>
              ) : pendingRequests.length === 0 ? (
                <p>No pending requests.</p>
              ) : (
                <div className="pending-list">
                  {pendingRequests.map((r) => (
                    <div className="pending-row" key={r.id}>
                      <div className="left-col">
                        <div className="emp-name">{r.employeeName || r.employee || r.username}</div>
                        <div className="date-range">{r.startDate} ➜ {r.endDate}</div>
                        <div className="reason">{r.reason}</div>
                      </div>
                      <div className="actions">
                        <button disabled={actionLoading} className="approve" onClick={() => handleApprove(r.id)}>Approve</button>
                        <button disabled={actionLoading} className="reject" onClick={() => handleReject(r.id)}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )} */}
          {activeTab === "pending" && <ManagerPendingRequests />}


          {activeTab === 'team-history' && (
            <section>
              <h3>Team Leave History</h3>
              {historyLoading ? (
                <p>Loading...</p>
              ) : leaveHistory.length === 0 ? (
                <p>No history found.</p>
              ) : (
                <table className="history-table">
                  <thead>
                    <tr><th>Employee</th><th>Type</th><th>Start</th><th>End</th><th>Reason</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {leaveHistory.map((l) => (
                      <tr key={l.id}>
                        <td>{l.employeeName || l.employee}</td>
                        <td>{l.leaveType}</td>
                        <td>{l.startDate}</td>
                        <td>{l.endDate}</td>
                        <td>{l.reason}</td>
                        <td className={l.status.toLowerCase()}>{l.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          )}

          {activeTab === 'calendar' && (
            <section>
              <h3>Team Calendar</h3>
              <p>(Calendar preview — you can integrate a calendar library such as react-big-calendar or FullCalendar.)</p>
              <div className="calendar-placeholder">
                {teamLeaves.map((l) => (
                  <div key={l.id} className="calendar-item">{l.employeeName || l.employee}: {l.startDate} → {l.endDate}</div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'apply' && (
            <section>
              <h3>Apply Leave</h3>
              <ApplyLeave onApplied={() => { fetchTeamLeaves(); fetchLeaveHistory(); }} />
            </section>
          )}

          {activeTab === 'holidays' && (
            <section>
              <h3>Holidays</h3>
              <EmployeeHolidayList holidays={holidays} />
            </section>
          )}

          {activeTab === 'profile' && (
            <section className="profile">
              <h3>Profile</h3>
              <p><strong>Name:</strong> {auth?.sub || auth?.username}</p>
              <p><strong>Role:</strong> {auth?.role}</p>
              <p><strong>Email / Sub:</strong> {auth?.email || auth?.sub}</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

// Helper: simple date check (expects YYYY-MM-DD or ISO strings)
function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
}

/*
  CSS: create a file at src/styles/managerDashboard.css and paste the styles below

.manager-dashboard { font-family: Arial, sans-serif; color: #222; }
.manager-navbar { display:flex; justify-content:space-between; align-items:center; padding:12px 20px; background:#1e293b; color: #fff; }
.manager-navbar .user { margin-right:12px; }
.manager-navbar .logout { background:#ef4444; border:none; color:#fff; padding:6px 10px; border-radius:6px; cursor:pointer; }
.manager-content { display:flex; height: calc(100vh - 64px); }
.mgr-sidebar { width:220px; background:#f8fafc; padding:12px; border-right:1px solid #e6e6e6; }
.side-btn { display:block; width:100%; text-align:left; padding:10px 12px; margin-bottom:8px; border-radius:6px; border:none; background:transparent; cursor:pointer; }
.side-btn:hover { background:#eef2ff; }
.side-btn.active { background:#6366f1; color:#fff; }
.mgr-main { padding:16px; flex:1; overflow:auto; }
.overview-cards { display:flex; gap:12px; margin-bottom:16px; }
.card { background:#fff; padding:16px; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.06); flex:1; }
.card .big { font-size:28px; font-weight:700; margin-top:6px; }
.pending-section .pending-list { display:flex; flex-direction:column; gap:8px; }
.pending-row { display:flex; justify-content:space-between; align-items:center; padding:10px; background:#fff; border-radius:6px; box-shadow:0 1px 3px rgba(0,0,0,0.04); }
.pending-row .emp-name { font-weight:600; }
.pending-row .date-range { color:#666; font-size:13px; }
.pending-row .reason { margin-top:6px; color:#333; }
.actions button { margin-left:8px; padding:8px 10px; border-radius:6px; border:none; cursor:pointer; }
.actions .approve { background:#10b981; color:#fff; }
.actions .reject { background:#ef4444; color:#fff; }
.history-table { width:100%; border-collapse:collapse; }
.history-table th, .history-table td { padding:8px 10px; border-bottom:1px solid #eee; }
.calendar-placeholder { display:flex; flex-direction:column; gap:6px; margin-top:8px; }
.calendar-item { background:#f1f5f9; padding:8px; border-radius:6px; }
.profile p { margin:6px 0; }
*/
