import React, { useState } from "react";
import useAuthStore from "../store/authStore";

export default function AddHoliday({ onAddSuccess }) {
  const [holiday, setHoliday] = useState({ name: "", date: "" });

  const auth = useAuthStore((state) => state.auth);

  const handleChange = (e) => setHoliday({ ...holiday, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    if (!auth || !auth.token) {
      alert("You must be logged in!");
      return;
    }
    e.preventDefault();
    const res = await fetch("http://localhost:8083/holidays", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.token}`   // <-- send token here
      },
      body: JSON.stringify(holiday),
    });
    if (res.ok) {
      alert("Holiday added!");
      setHoliday({ name: "", date: "" });
      if (onAddSuccess) onAddSuccess(); // refresh list dynamically
    } else {
      alert("Error adding holiday");
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Holiday Name" value={holiday.name} onChange={handleChange} required />
      <input type="date" name="date" value={holiday.date} onChange={handleChange} required />
      <button type="submit">Add Holiday</button>
    </form>
  );
}
