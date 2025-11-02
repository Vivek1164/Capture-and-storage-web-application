import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

// ✅ Helper to get token from localStorage
const getToken = () => localStorage.getItem("token");

// ✅ Fetch all media
const getMedia = async () => {
  const token = getToken();
  const res = await axios.get(`${API_BASE_URL}/media`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data.items; // since your API returns data.items[]
};

// ✅ Upload media
const uploadMedia = async (formData) => {
  const token = getToken();
  const res = await axios.post(`${API_BASE_URL}/media/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.media; // returns uploaded file info
};

// ✅ Delete media
const deleteMedia = async (id) => {
  const token = getToken();
  const res = await axios.delete(`${API_BASE_URL}/media/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export default { getMedia, uploadMedia, deleteMedia };
