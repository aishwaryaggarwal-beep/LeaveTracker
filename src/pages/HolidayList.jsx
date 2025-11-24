import React, { useState } from "react";
import "../styles/Dashboard.css";
import useAuthStore from "../store/authStore";
export default function HolidayList({ holidays, onUpdate, onDelete }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editHoliday, setEditHoliday] = useState({});

  const auth = useAuthStore((state) => state.auth);

  const startEdit = (holiday, index) => {
    setEditingIndex(index);
    setEditHoliday({ ...holiday });
  };

  const handleEditChange = (e) => {
    setEditHoliday({ ...editHoliday, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    const res = await fetch(`http://localhost:8083/holidays/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.token}`   // <-- send token here
      },
      body: JSON.stringify(editHoliday),
    });
    if (res.ok) {
      alert("Holiday updated!");
      setEditingIndex(null);
      onUpdate();
    }
  };

  const deleteHoliday = async (id) => {
    if (!window.confirm("Are you sure to delete this holiday?")) return;
    const res = await fetch(`http://localhost:8083/holidays/${id}`, {
       method: "DELETE",
       headers: {
        "Content-Type": "application/json",
         "Authorization": `Bearer ${auth.token}`
       }
     });
    if (res.ok) {
      alert("Holiday deleted!");
      onDelete();
    }
  };

  return (
    <div>
      <h3>Holiday List</h3>
      <table className="employee-table">
        <thead>
          <tr><th>Name</th><th>Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {holidays.map((h, index) => (
            <tr key={index}>
              <td>{editingIndex === index ? (
                <input name="name" value={editHoliday.name} onChange={handleEditChange} />
              ) : h.name}</td>
              <td>{editingIndex === index ? (
                <input type="date" name="date" value={editHoliday.date} onChange={handleEditChange} />
              ) : h.date}</td>
              <td>
                {editingIndex === index ? (
                  <button onClick={() => saveEdit(h.id)}>Save</button>
                ) : (
                  <>
                    <button onClick={() => startEdit(h, index)}>Edit</button>
                    <button onClick={() => deleteHoliday(h.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
