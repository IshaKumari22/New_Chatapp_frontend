import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import UserList from "./components/UserList";
import Chat from "./components/Chat"; // your chat page component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/chat/:threadId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
