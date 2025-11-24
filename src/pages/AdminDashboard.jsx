import React, { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

import AddEmployee from "./AddEmployee";
import EmployeeList from "./EmployeeList";
import AddHoliday from "./AddHoliday";
import HolidayList from "./HolidayList";

import "../styles/dashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const auth = useAuthStore((s) => s.auth);
  const logout = useAuthStore((s) => s.logout);

  const [employeeAccordion, setEmployeeAccordion] = useState("add");
  const [holidayAccordion, setHolidayAccordion] = useState("add");

  const [employees, setEmployees] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const token = localStorage.getItem("token");

  // ---------------- FETCH EMPLOYEES ----------------
  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:8083/emp", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch employees");
        return;
      }

      const data = await res.json();
      console.log("Fetched Employees:", data);
      setEmployees(data);
    } catch (err) {
      console.error("EMPLOYEE FETCH ERROR →", err);
    }
  };

  // ---------------- FETCH HOLIDAYS ----------------
  const fetchHolidays = async () => {
    try {
      const res = await fetch("http://localhost:8083/holidays", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch holidays");
        return;
      }

      const data = await res.json();
      setHolidays(data);
    } catch (err) {
      console.error("HOLIDAY FETCH ERROR →", err);
    }
  };

  // ---------------- AUTH CHECK + INITIAL FETCH ----------------
  useEffect(() => {
    if (!auth || auth.role !== "ADMIN") {
      navigate("/login");
      return;
    }

    fetchEmployees();
    fetchHolidays();
  }, [auth]);

  return (
    <div className="dashboard-container">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="navbar-left">
          <h2>Admin Dashboard</h2>
        </div>

        <div className="navbar-right">
          <span className="user-text">
            {auth?.username} ({auth?.role})
          </span>

          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">

        {/* LEFT — EMPLOYEE MGMT */}
        <div className="left-panel">
          <h3>Employee Management</h3>

          <div className="accordion">

            {/* ADD EMPLOYEE */}
            <div
              className="accordion-header"
              onClick={() =>
                setEmployeeAccordion(
                  employeeAccordion === "add" ? "" : "add"
                )
              }
            >
              <h4>Add Employee</h4>
            </div>

            {employeeAccordion === "add" && (
              <div className="accordion-body">
                <AddEmployee onAddSuccess={fetchEmployees} />
              </div>
            )}

            {/* EMPLOYEE LIST */}
            <div
              className="accordion-header"
              onClick={() =>
                setEmployeeAccordion(
                  employeeAccordion === "list" ? "" : "list"
                )
              }
            >
              <h4>Employee List</h4>
            </div>

            {employeeAccordion === "list" && (
              <div className="accordion-body">
                <EmployeeList
                  employees={employees}
                  onUpdate={fetchEmployees}
                  onDelete={fetchEmployees}
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — HOLIDAY MGMT */}
        <div className="right-panel">
          <h3>Holiday Management</h3>

          <div className="accordion">

            {/* ADD HOLIDAY */}
            <div
              className="accordion-header"
              onClick={() =>
                setHolidayAccordion(
                  holidayAccordion === "add" ? "" : "add"
                )
              }
            >
              <h4>Add Holiday</h4>
            </div>

            {holidayAccordion === "add" && (
              <div className="accordion-body">
                <AddHoliday onAddSuccess={fetchHolidays} />
              </div>
            )}

            {/* HOLIDAY LIST */}
            <div
              className="accordion-header"
              onClick={() =>
                setHolidayAccordion(
                  holidayAccordion === "list" ? "" : "list"
                )
              }
            >
              <h4>Holiday List</h4>
            </div>

            {holidayAccordion === "list" && (
              <div className="accordion-body">
                <HolidayList
                  holidays={holidays}
                  onUpdate={fetchHolidays}
                  onDelete={fetchHolidays}
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
