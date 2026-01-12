import { createContext, useEffect, useState } from "react";
import API from "../api/axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (userData && token) {
        try {
          // call a protected endpoint to validate token
          await API.get("/chat");
          setUser(JSON.parse(userData));
        } catch (err) {
          localStorage.clear();
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setReady(true);
    };

    checkAuth();
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
