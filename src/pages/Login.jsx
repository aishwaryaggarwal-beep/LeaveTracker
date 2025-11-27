import React, { useState } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await fetch("http://localhost:8082/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const token = await res.text();

  if (token !== "Failure") {
    login(token); // store token and role in AuthStore

    // Decode JWT payload
    const decoded = JSON.parse(atob(token.split(".")[1]));
    console.log("Decoded JWT:", decoded);

    // Redirect based on role
    const userRole = decoded.roles[0]; // take the first role
    if (userRole === "ADMIN") navigate("/admin");
    else if (userRole === "MANAGER") navigate("/manager");
    else  navigate("/dashboard");
  } else {
    alert("Invalid credentials");
  }
};


  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title"> Login to Leave Portal</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
