// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useLocation } from "react-router-dom";

// function Chat() {
//   const { state } = useLocation();
//   const { username } = state; // logged-in user
//   const token = localStorage.getItem("token");
//   const { threadId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const socketRef = useRef(null);
//   const chatDivRef = useRef(null);

//   // 1️⃣ Load old messages from REST API
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await fetch(
//           `http://127.0.0.1:8000/thread/${threadId}/messages/`,
//           { headers: { Authorization: `Token ${token}` } }
//         );
//         const data = await res.json();
//         // Ensure messages are in order: oldest → newest
//         data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
//         setMessages(data);
//       } catch (err) {
//         console.error("Failed to fetch messages", err);
//       }
//     };

//     fetchMessages();
//   }, [threadId, token]);

//   // 2️⃣ WebSocket connection
//   useEffect(() => {
//     const wsUrl = `ws://127.0.0.1:8000/ws/chat/${threadId}/`;
//     socketRef.current = new WebSocket(wsUrl);

//     socketRef.current.onopen = () => console.log("WebSocket connected!");

//     socketRef.current.onmessage = (e) => {
//       const data = JSON.parse(e.data);
//       const newMsg={
//         id:data.id || Date.now(),
//         sender:{username:data.sender},
//         content:data.message,
//         created_at:data.created_at || new Date().toISOString(),
//       }
//          setMessages((prev) => {
//         // Avoid duplicates using id + content
//         if (prev.some((m) => m.content === newMsg.content && m.sender.username === newMsg.sender.username)) {
//           return prev;
//         }
//         return [...prev, newMsg];
//       });
//     };
//     socketRef.current.onclose = () => console.log("WebSocket closed");

//     return () => socketRef.current.close();
//   }, [threadId]);

//   // 3️⃣ Send message via WebSocket
//   const handleSend = () => {
//     if (!text.trim()) return;
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       socketRef.current.send(JSON.stringify({ message: text, sender: username }));
//       setText(""); // Do not add locally; wait for WebSocket broadcast
//     }
//   };

//   // 4️⃣ Auto-scroll to latest message
//   useEffect(() => {
//     if (chatDivRef.current) {
//       chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div className="container mt-4">
//       <h3>Chat with {username}</h3>

//       <div
//         ref={chatDivRef}
//         className="border p-3 mb-3"
//         style={{ height: "300px", overflowY: "scroll" }}
//       >
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
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

  // 🕒 format time as HH:MM
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // 📅 format date as Today / Yesterday / dd MMM
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // 1️⃣ Load old messages from REST API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/thread/${threadId}/messages/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        const data = await res.json();
        data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
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

    socketRef.current.onopen = () => console.log("✅ WebSocket connected");

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      const newMsg = {
        id: data.id || Date.now(),
        sender: { username: data.sender },
        content: data.message,
        created_at: data.created_at || new Date().toISOString(),
      };

      setMessages((prev) => {
        if (
          prev.some(
            (m) =>
              m.content === newMsg.content &&
              m.sender.username === newMsg.sender.username
          )
        ) {
          return prev;
        }
        return [...prev, newMsg];
      });
    };

    socketRef.current.onclose = () => console.log("❌ WebSocket closed");

    return () => socketRef.current.close();
  }, [threadId]);

  // 3️⃣ Send message via WebSocket
  const handleSend = () => {
    if (!text.trim()) return;
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ message: text, sender: username })
      );
      setText("");
    }
  };

  // 4️⃣ Auto-scroll to latest message
  useEffect(() => {
    if (chatDivRef.current) {
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
    }
  }, [messages]);

  // 🟢 Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const dateKey = formatDate(msg.created_at);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(msg);
    return groups;
  }, {});

  return (
    <div className="container mt-4">
      <h3>Chat with {username}</h3>

      <div
        ref={chatDivRef}
        className="border p-3 mb-3"
        style={{ height: "300px", overflowY: "scroll" }}
      >
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            {/* 📅 Date Separator */}
            <div className="text-center text-muted my-2">
              <small>{date}</small>
            </div>

            {groupedMessages[date].map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 ${
                  msg.sender.username === username ? "text-end" : "text-start"
                }`}
              >
                <b>{msg.sender.username}</b>: {msg.content}
                <div style={{ fontSize: "0.75rem", color: "gray" }}>
                  {formatTime(msg.created_at)}
                </div>
              </div>
            ))}
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
