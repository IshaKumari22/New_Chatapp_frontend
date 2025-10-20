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
//       setMessages((prev) => {
//         // Avoid duplicate messages
//         if (prev.some(m => m.sender.username === data.sender && m.content === data.message)) {
//           return prev;
//         }
//         return [...prev, { sender: { username: data.sender }, content: data.message }];
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

//   // 1️⃣ Load old messages (for user-to-user chat)
//   useEffect(() => {
//     if (threadId === "ai") return; // skip for AI chat
//     const fetchMessages = async () => {
//       try {
//         const res = await fetch(
//           `http://127.0.0.1:8000/thread/${threadId}/messages/`,
//           { headers: { Authorization: `Token ${token}` } }
//         );
//         const data = await res.json();
//         data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
//         setMessages(data);
//       } catch (err) {
//         console.error("Failed to fetch messages", err);
//       }
//     };

//     fetchMessages();
//   }, [threadId, token]);

//   // 2️⃣ WebSocket connection for normal chat
//   useEffect(() => {
//     if (threadId === "ai") return; // no WebSocket needed for AI
//     const wsUrl = `ws://127.0.0.1:8000/ws/chat/${threadId}/`;
//     socketRef.current = new WebSocket(wsUrl);

//     socketRef.current.onopen = () => console.log("WebSocket connected!");

//     socketRef.current.onmessage = (e) => {
//       const data = JSON.parse(e.data);
//       setMessages((prev) => {
//         // Avoid duplicates
//         if (
//           prev.some(
//             (m) =>
//               m.sender.username === data.sender &&
//               m.content === data.message
//           )
//         ) {
//           return prev;
//         }
//         return [
//           ...prev,
//           { sender: { username: data.sender }, content: data.message },
//         ];
//       });
//     };

//     socketRef.current.onclose = () => console.log("WebSocket closed");

//     return () => socketRef.current?.close();
//   }, [threadId]);

//   // 3️⃣ Send message (WebSocket or TinyLLaMA)
//   const handleSend = async () => {
//     if (!text.trim()) return;

//     // --- AI Chat Mode ---
//     if (threadId === "ai") {
//       const userMsg = { sender: { username }, content: text };
//       setMessages((prev) => [...prev, userMsg]);
//       setText("");

//       try {
//         const res = await fetch("http://127.0.0.1:8000/api/generate/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ prompt: text }),
//         });
//         const data = await res.json();
//         const aiMsg = {
//           sender: { username: "TinyLLaMA 🤖" },
//           content: data.response || "(no reply)",
//         };
//         setMessages((prev) => [...prev, aiMsg]);
//       } catch (err) {
//         console.error("AI Error:", err);
//         setMessages((prev) => [
//           ...prev,
//           {
//             sender: { username: "System" },
//             content: "⚠️ Could not reach TinyLLaMA backend.",
//           },
//         ]);
//       }
//       return;
//     }

//     // --- Normal Chat Mode ---
//     if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//       socketRef.current.send(
//         JSON.stringify({ message: text, sender: username })
//       );
//       setText(""); // clear input
//     }
//   };

//   // 4️⃣ Auto-scroll
//   useEffect(() => {
//     if (chatDivRef.current) {
//       chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div className="container mt-4">
//       <h3>
//         {threadId === "ai"
//           ? "💬 Chat with TinyLLaMA 🤖"
//           : `Chat with Thread ${threadId}`}
//       </h3>

//       <div
//         ref={chatDivRef}
//         className="border p-3 mb-3"
//         style={{ height: "300px", overflowY: "auto", background: "#fafafa" }}
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
//           placeholder="Type a message..."
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
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const chatDivRef = useRef(null);

  // 1️⃣ Load old messages (for user-to-user chat)
  useEffect(() => {
    if (threadId === "ai") return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/thread/${threadId}/messages/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        const data = await res.json();
        data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
  }, [threadId, token]);

  // 2️⃣ WebSocket connection for user-to-user chat
  useEffect(() => {
    if (threadId === "ai") return;
    const wsUrl = `ws://127.0.0.1:8000/ws/chat/${threadId}/`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => console.log("WebSocket connected!");
    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [
        ...prev,
        { sender: { username: data.sender }, content: data.message },
      ]);
    };

    socketRef.current.onclose = () => console.log("WebSocket closed");

    return () => socketRef.current?.close();
  }, [threadId]);

  // 3️⃣ Send message (handles @c for AI locally)
  const handleSend = async () => {
    if (!text.trim()) return;

    // --- AI Chat Mode (direct AI chat) ---
    if (threadId === "ai") {
      await handleAIMessage(text);
      return;
    }

    // --- Hybrid Mode: @c triggers TinyLLaMA ---
    if (text.trim().startsWith("@c")) {
      const cleanPrompt = text.replace("@c", "").trim();
      if (!cleanPrompt) return;

      const userMsg = { sender: { username }, content: text };
      setMessages((prev) => [...prev, userMsg]);
      setText("");
      setLoading(true);

      try {
        const res = await fetch("http://127.0.0.1:8000/api/generate/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: cleanPrompt }),
        });
        const data = await res.json();
        const aiMsg = {
          sender: { username: "TinyLLaMA 🤖" },
          content: data.response || "(no reply)",
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        console.error("AI Error:", err);
        setMessages((prev) => [
          ...prev,
          {
            sender: { username: "System" },
            content: "⚠️ Could not reach TinyLLaMA backend.",
          },
        ]);
      } finally {
        setLoading(false);
      }

      return; // 🚫 Don't send to WebSocket
    }

    // --- Normal user-to-user message ---
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({ message: text, sender: username })
      );
      setText("");
    }
  };

  // 🔹 Helper for direct AI chat (for /chat/ai)
  const handleAIMessage = async (prompt) => {
    const userMsg = { sender: { username }, content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setText("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/generate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const aiMsg = {
        sender: { username: "TinyLLaMA 🤖" },
        content: data.response || "(no reply)",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: { username: "System" },
          content: "⚠️ Could not reach TinyLLaMA backend.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 4️⃣ Auto-scroll
  useEffect(() => {
    if (chatDivRef.current) {
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="container mt-4">
      <h3>
        {threadId === "ai"
          ? "💬 Chat with TinyLLaMA 🤖"
          : `Chat with Thread ${threadId}`}
      </h3>

      <div
        ref={chatDivRef}
        className="border p-3 mb-3 rounded"
        style={{ height: "350px", overflowY: "auto", background: "#fafafa" }}
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

        {/* AI Loading */}
        {loading && (
          <div className="text-start mt-2">
            <b>TinyLLaMA 🤖:</b>{" "}
            <span className="inline-flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </span>
          </div>
        )}
      </div>

      <div className="d-flex">
        <input
          className="form-control me-2"
          placeholder="Type a message... (use @c for AI)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button
          className={`btn ${loading ? "btn-secondary" : "btn-dark"}`}
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chat;
