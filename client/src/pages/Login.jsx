import { useState, useContext } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email: email.toLowerCase(), password });
      // update global auth state and localStorage via context
      login(res.data);
      navigate("/chat");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed";
      alert(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Sign in to jump back into your chats.</p>

        <div className="form-stack">
          <input value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input value={password} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        </div>

        <div className="form-footer">
          <span>
            New here? <Link to="/register">Create an account</Link>
          </span>
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
