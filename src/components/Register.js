import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // success/error message
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const navigate = useNavigate();

    useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Account created successfully! Please login.");
        setMessageType("success");

        // Clear form
        setUsername("");
        setEmail("");
        setPassword("");

        // Optional: Redirect to login after 2 seconds
        setTimeout(() => navigate("/"), 2000);
      } else {
        // Show backend errors inside UI
        const errorMsg =
          typeof data === "object"
            ? Object.values(data).flat().join(" ")
            : "❌ Registration failed.";
        setMessage(`❌ ${errorMsg}`);
        setMessageType("error");



        setUsername("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setMessage("❌ Server error. Please try again later.");
      setMessageType("error");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-4">
        <div className="card shadow p-4">
          <h3 className="text-center mb-4">Register</h3>

          {/* Success/Error message */}
          {message && (
            <div
              className={`alert ${
                messageType === "success" ? "alert-success" : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <button type="submit" className="btn btn-dark w-100">
              Sign Up
            </button>

            <div className="mt-3 text-center">
              Already have an account? <a href="/">Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
