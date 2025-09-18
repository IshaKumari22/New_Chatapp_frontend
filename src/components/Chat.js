import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

function Chat() {
  const { state } = useLocation();
  const { username } = state; // selected user
  const { userId } = useParams();
  const token = localStorage.getItem("token");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/thread/${userId}/messages/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  const handleSend = async () => {
    if (!text) return;
    try {
      await fetch(`http://127.0.0.1:8000/thread/${userId}/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ content: text }),
      });
      setText("");
      fetchMessages(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Chat with {username}</h3>
      <div className="border p-3 mb-3" style={{ height: "300px", overflowY: "scroll" }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 ${msg.sender.username === username ? "text-start" : "text-end"}`}>
            <b>{msg.sender.username}:</b> {msg.content}
          </div>
        ))}
      </div>
      <div className="d-flex">
        <input
          className="form-control me-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-dark" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
