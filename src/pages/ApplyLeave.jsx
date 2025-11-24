import React, { useState } from "react";
import useAuthStore from "../store/authStore";
import "../styles/applyleave.css";

export default function ApplyLeave() {
  const auth = useAuthStore((s) => s.auth);
  const token = useAuthStore((s) => s.token);

  const [form, setForm] = useState({
    type: "CASUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId: auth?.id || auth?.sub,  // JWT ID or username
      leaveType: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason,
    };

    try {
      const res = await fetch("http://localhost:8080/leave/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to apply leave");

      setMessage("Leave applied successfully!");
      setForm({ type: "CASUAL", startDate: "", endDate: "", reason: "" });
    } catch (error) {
      console.error(error);
      setMessage("Error applying leave.");
    }
  };

  return (
    <div className="apply-container">
      <h3>Apply for Leave</h3>

      <form className="apply-form" onSubmit={handleSubmit}>
        <label>Leave Type</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="CASUAL">Casual Leave</option>
          <option value="SICK">Sick Leave</option>
          <option value="PRIVILEGE">Privilege Leave</option>
        </select>

        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
        />

        <label>End Date</label>
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          required
        />

        <label>Reason</label>
        <textarea
          name="reason"
          rows="3"
          value={form.reason}
          onChange={handleChange}
          placeholder="Describe your reason..."
          required
        />

        <button type="submit" className="submit-btn">
          Submit Leave
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
