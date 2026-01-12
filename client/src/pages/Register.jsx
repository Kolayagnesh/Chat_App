import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", {
        username,
        email: email.toLowerCase(),
        password
      });
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed";
      alert(msg);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create your space</h2>
        <p className="auth-subtitle">Set up your account and start chatting in seconds.</p>

        <div className="form-stack">
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-footer">
          <span>Already have an account?</span>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
