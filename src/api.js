const BASE_URL = "http://127.0.0.1:8000";

// Get token from localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// Register
export async function register(data) {
  const res = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Login
export async function login(data) {
  const res = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Get all users except logged-in
export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users/`, {
    headers: { "Authorization": `Token ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// Create chat thread with a user
export async function createThread(userId) {
  const res = await fetch(`${BASE_URL}/thread/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${getToken()}`
    },
    body: JSON.stringify({ user_id: userId }),
  });
  return res.json();
}

// Get messages
export async function getMessages(threadId) {
  const res = await fetch(`${BASE_URL}/thread/${threadId}/messages/`, {
    headers: { "Authorization": `Token ${getToken()}` },
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

// Send message
export async function sendMessage(threadId, data) {
  const res = await fetch(`${BASE_URL}/thread/${threadId}/messages/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${getToken()}`
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
