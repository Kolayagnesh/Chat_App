import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/chat" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
