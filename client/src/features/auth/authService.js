import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/";

const requestOtp = async (email) => {
  const res = await axios.post(`${API}/auth/send-otp`, { email });
  return res.data;
};

const verifyOtp = async (email, otp, name, password) => {
  const res = await axios.post(`${API}/auth/verify-otp`, {
    email,
    otp,
    name,
    password,
  });
  if (res.data?.token) localStorage.setItem("token", res.data.token);
  return res.data; // should include token & user info
};

const login = async (email, password) => {
  const res = await axios.post(`${API}/auth/login`, { email, password });
  if (res.data?.token) localStorage.setItem("token", res.data.token);
  if (res.data?.user)
    localStorage.setItem("user", JSON.stringify(res.data.user));
  return res.data; // should include token & user info
};

export default { requestOtp, verifyOtp, login };
