import React, { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import "../styles/managerPending.css";

export default function ManagerPendingRequests() {
  const token = useAuthStore((s) => s.token);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await fetch("http://localhost:8081/leave/pending", {
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) throw new Error("Failed to fetch pending requests");

      const data = await res.json();
      setPending(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id, approve) => {
    try {
      const res = await fetch(
        `http://localhost:8081/leave/approve/${id}?approve=${approve}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      // Refresh the list
      fetchPending();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  if (loading) return <p>Loading pending requests...</p>;

  return (
    <div className="pending-container">
      <h3>Pending Leave Requests</h3>

      {pending.length === 0 ? (
        <p className="empty">No pending requests.</p>
      ) : (
        <table className="pending-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Leave Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {pending.map((req) => (
              <tr key={req.id}>
                <td>{req.employeeId}</td>
                <td>{req.leaveType}</td>
                <td>
                  {req.startDate} → {req.endDate}
                </td>
                <td>{req.reason}</td>

                <td className="btn-cell">
                  <button
                    className="approve-btn"
                    onClick={() => handleDecision(req.id, true)}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleDecision(req.id, false)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
