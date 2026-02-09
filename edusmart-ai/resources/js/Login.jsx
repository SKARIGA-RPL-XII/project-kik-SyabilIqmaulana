import React, { useState } from "react";
import axios from "axios";
import eyeOpen from "./assets/eye-open.svg";
import eyeClose from "./assets/eye-close.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      setError("Email atau password salah!");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2 className="logo-title">🎓 EduSmart AI</h2>
        <p className="subtitle">Smart Learning Management System</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-box">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              src={showPass ? eyeClose : eyeOpen}
              onClick={() => setShowPass(!showPass)}
              className="eye-icon"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
}
