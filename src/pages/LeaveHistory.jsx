import React, { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import "../styles/leavehistory.css";

export default function LeaveHistory() {
  const token = useAuthStore((s) => s.token);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:8081/leave/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch leave history");

      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) return <p>Loading leave history...</p>;

  return (
    <div className="history-container">
      <h3>Your Leave History</h3>

      {history.length === 0 ? (
        <p className="empty">No leave records found.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>Start</th>
              <th>End</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {history.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.leaveType}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.reason}</td>
                <td className={leave.status.toLowerCase()}>
                  {leave.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
