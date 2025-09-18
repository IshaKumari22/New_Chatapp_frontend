import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token"); // saved at login
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/users/", {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [token]);

  // when clicking a user → create/get thread
  const handleChat = async (otherUserId) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/thread/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ other_user: otherUserId }),
      });
      const data = await res.json();
      if (data.id) {
        navigate(`/chat/${data.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>All Users</h3>
      <ul className="list-group">
        {users.map((u) => (
          <li
            key={u.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {u.username}
            <button
              className="btn btn-sm btn-dark"
              onClick={() => handleChat(u.id)}
            >
              Chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
