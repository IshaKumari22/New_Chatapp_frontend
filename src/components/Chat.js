// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useLocation } from "react-router-dom";

// function Chat() {
//   const { state } = useLocation();
//   const { username } = state; // current user
//   const token = localStorage.getItem("token");
//   const { threadId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const socketRef = useRef(null);

//   // Load old messages once
//   useEffect(() => {
//     fetchMessages();
//   }, [threadId]);

//   const fetchMessages = async () => {
//     try {
//       const res = await fetch(
//         `http://127.0.0.1:8000/thread/${threadId}/messages/`,
//         { headers: { Authorization: `Token ${token}` } }
//       );
//       const data = await res.json();
//       setMessages(data);
//     } catch (err) {
//       console.error("Failed to fetch messages", err);
//     }
//   };

//   // WebSocket connection
//   useEffect(() => {
//     const wsUrl = `ws://127.0.0.1:8000/ws/chat/${threadId}/`;
//     socketRef.current = new WebSocket(wsUrl);

//     socketRef.current.onopen = () => console.log("WebSocket connected!");

//     socketRef.current.onmessage = (e) => {
//       const data = JSON.parse(e.data);
//       setMessages((prev) => [
//         ...prev,
//         { sender: { username: data.sender }, content: data.message },
//       ]);
//     };

//     socketRef.current.onclose = () => console.log("WebSocket closed");

//     return () => socketRef.current.close();
//   }, [threadId]);

//   const handleSend = () => {
//     if (!text.trim()) return;
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       socketRef.current.send(JSON.stringify({ message: text, sender: username }));
//       // setMessages((prev) => [...prev, { sender: { username }, content: text }]);
//       setText("");
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h3>Chat with {username}</h3>
//       <div
//         className="border p-3 mb-3"
//         style={{ height: "300px", overflowY: "scroll" }}
//       >
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`mb-2 ${
//               msg.sender.username === username ? "text-end" : "text-start"
//             }`}
//           >
//             <b>{msg.sender.username}:</b> {msg.content}
//           </div>
//         ))}
//       </div>
//       <div className="d-flex">
//         <input
//           className="form-control me-2"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//         />
//         <button className="btn btn-dark" onClick={handleSend}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Chat;
import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";

function Chat() {
  const { state } = useLocation();
  const { username } = state; // logged-in user
  const token = localStorage.getItem("token");
  const { threadId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const chatDivRef = useRef(null);

  // 1️⃣ Load old messages from REST API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/thread/${threadId}/messages/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        const data = await res.json();
        // Ensure messages are in order: oldest → newest
        data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
  }, [threadId, token]);

  // 2️⃣ WebSocket connection
  useEffect(() => {
    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${threadId}/`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => console.log("WebSocket connected!");

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => {
        // Avoid duplicate messages
        if (prev.some(m => m.sender.username === data.sender && m.content === data.message)) {
          return prev;
        }
        return [...prev, { sender: { username: data.sender }, content: data.message }];
      });
    };

    socketRef.current.onclose = () => console.log("WebSocket closed");

    return () => socketRef.current.close();
  }, [threadId]);

  // 3️⃣ Send message via WebSocket
  const handleSend = () => {
    if (!text.trim()) return;
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: text, sender: username }));
      setText(""); // Do not add locally; wait for WebSocket broadcast
    }
  };

  // 4️⃣ Auto-scroll to latest message
  useEffect(() => {
    if (chatDivRef.current) {
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="container mt-4">
      <h3>Chat with {username}</h3>

      <div
        ref={chatDivRef}
        className="border p-3 mb-3"
        style={{ height: "300px", overflowY: "scroll" }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.sender.username === username ? "text-end" : "text-start"
            }`}
          >
            <b>{msg.sender.username}:</b> {msg.content}
          </div>
        ))}
      </div>

      <div className="d-flex">
        <input
          className="form-control me-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="btn btn-dark" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
