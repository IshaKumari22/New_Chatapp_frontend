import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token"); // saved at login
  const navigate = useNavigate();


  // 🔹 Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/users/", {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [token]);

  // 🔹 Start chat with a specific user
  const startChat = async (id, username) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/thread/${id}/start/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        navigate(`/chat/${data.id}`, { state: { username } });
      } else {
        console.error(data);
      }
    } catch (err) {
      console.error("Error starting chat:", err);
    }
  };

  // 🔹 Start AI Chat (TinyLLaMA)
  const startAIChat = () => {
    const username = localStorage.getItem("username");
    navigate("/chat/ai", { state: { username } });
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "600px" }}>
      <h3 className="mb-3">All Users</h3>

      {/* --- User List --- */}
      <ul className="list-group mb-4">
        {users.length > 0 ? (
          users.map((user) => (
            <li
              key={user.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {user.username}
              <button
                className="btn btn-sm btn-dark"
                onClick={() => startChat(user.id, user.username)}
              >
                Chat
              </button>
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>

      {/* --- AI Chat Section --- */}
      <h4 className="mb-3">Chat with AI</h4>
      <div className="card shadow-sm p-3 d-flex flex-row justify-content-between align-items-center">
        <div>
          <span style={{ fontSize: "1.2rem" }}>🤖 TinyLLaMA Assistant</span>
          <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
            Talk to your local AI model powered by TinyLLaMA.
          </p>
        </div>
        <button className="btn btn-success btn-sm" onClick={startAIChat}>
          Chat with AI
        </button>
      </div>
    </div>
  );
}

export default UserList;