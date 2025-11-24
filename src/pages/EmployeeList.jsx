import React, { useState } from "react";
import "../styles/Dashboard.css";
import useAuthStore from "../store/authStore";
export default function EmployeeList({ employees, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editEmployee, setEditEmployee] = useState({});
 const auth = useAuthStore((state) => state.auth); 
  if (!auth || !auth.token) {
      alert("You must be logged in!");
      return;
    }
  const startEdit = (emp) => {
    setEditingId(emp.employeeId);
    setEditEmployee({ ...emp });
  };

  const handleEditChange = (e) => {
    setEditEmployee({ ...editEmployee, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    const res = await fetch(`http://localhost:8083/emp/${editingId}`, {
      method: "PUT",
       headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.token}`   // <-- send token here
      },
      body: JSON.stringify(editEmployee),
    });
    if (res.ok) {
      alert("Employee updated!");
      setEditingId(null);
      onUpdate(); // refresh list
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure to delete this employee?")) return;
    const res = await fetch(`http://localhost:8083/emp/${id}`, { 
      method: "DELETE",
       headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.token}`   // <-- send token here
      },
     });
    if (res.ok) {
      alert("Employee deleted!");
      onDelete(); // refresh list
    }
  };

  return (
    <div>
      <h3>Employee List</h3>
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Dept</th><th>Role</th><th>Manager</th><th>Joining Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.employeeId}>
              <td>{emp.employeeId}</td>
              <td>
                {editingId === emp.employeeId ? (
                  <input name="name" value={editEmployee.name} onChange={handleEditChange} />
                ) : emp.name}
              </td>
              <td>{editingId === emp.employeeId ? (
                  <input name="email" value={editEmployee.email} onChange={handleEditChange} />
                ) : emp.email}</td>
              <td>{editingId === emp.employeeId ? (
                  <input name="departmentId" value={editEmployee.departmentId} onChange={handleEditChange} />
                ) : emp.departmentId}</td>
              <td>{editingId === emp.employeeId ? (
                  <input name="role" value={editEmployee.role} onChange={handleEditChange} />
                ) : emp.role}</td>
              <td>{editingId === emp.employeeId ? (
                  <input name="managerId" value={editEmployee.managerId} onChange={handleEditChange} />
                ) : emp.managerId}</td>
              <td>{editingId === emp.employeeId ? (
                  <input type="date" name="joiningDate" value={editEmployee.joiningDate} onChange={handleEditChange} />
                ) : emp.joiningDate}</td>
              <td>
                {editingId === emp.employeeId ? (
                  <button onClick={saveEdit}>Save</button>
                ) : (
                  <>
                    <button onClick={() => startEdit(emp)}>Edit</button>
                    <button onClick={() => deleteEmployee(emp.employeeId)}>Delete</button>
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
