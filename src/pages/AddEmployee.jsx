import React, { useState } from "react";
import useAuthStore from "../store/authStore";

export default function AddEmployee({ onAddSuccess }) {
  const [employee, setEmployee] = useState({
    employeeId: "",
    name: "",
    email: "",
    departmentId: "",
    role: "",
    managerId: "",
    joiningDate: ""
  });

  const auth = useAuthStore((state) => state.auth); // get logged-in user's token
  console.log("AddEmployee Auth:", auth);

  const handleChange = (e) => setEmployee({ ...employee, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth || !auth.token) {
      alert("You must be logged in!");
      return;
    }

    const res = await fetch("http://localhost:8083/emp/add", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.token}`   // <-- send token here
      },
      body: JSON.stringify(employee),
    });

    console.log("Add Employee Response:", res);

    if (res.ok) {
      alert("Employee added successfully!");
      setEmployee({
        employeeId: "",
        name: "",
        email: "",
        departmentId: "",
        role: "",
        managerId: "",
        joiningDate: ""
      });
      if (onAddSuccess) onAddSuccess(); // refresh list dynamically
    } else {
      const text = await res.text();
      alert("Error adding employee: " + text);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input name="employeeId" type="number" placeholder="Employee ID" value={employee.employeeId} onChange={handleChange} required />
      <input name="name" type="text" placeholder="Name" value={employee.name} onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" value={employee.email} onChange={handleChange} required />
      <input name="departmentId" type="text" placeholder="Department ID" value={employee.departmentId} onChange={handleChange} required />
      <input name="role" type="text" placeholder="Role" value={employee.role} onChange={handleChange} required />
      <input name="managerId" type="text" placeholder="Manager ID" value={employee.managerId} onChange={handleChange} />
      <input name="joiningDate" type="date" value={employee.joiningDate} onChange={handleChange} required />
      <button type="submit">Add Employee</button>
    </form>
  );
}
