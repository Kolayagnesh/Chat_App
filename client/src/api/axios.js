import axios from "axios";

const API = axios.create({
  baseURL: "https://chat-app-backend-hqmw.onrender.com/api"
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.clear();
      // force navigation to login
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default API;
