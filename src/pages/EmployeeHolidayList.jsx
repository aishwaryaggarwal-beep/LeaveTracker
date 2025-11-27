// EmployeeHolidayList.jsx
import React from "react";
import "../styles/Dashboard.css";

export default function EmployeeHolidayList({ holidays }) {
  return (
    <div>
      <h3>Holiday List</h3>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((h, index) => (
            <tr key={index}>
              <td>{h.name}</td>
              <td>{h.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
