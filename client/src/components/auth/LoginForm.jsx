import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import { useState } from "react";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { loading, email, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email, password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.email) {
      alert("Please enter your email before logging in.");
      return;
    }

    dispatch(loginUser(form));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="max-w-md m-auto p-6 bg-white rounded-2xl shadow"
    >
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={form.email}
        disabled={!!email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          mt: 2,
          py: 1.2,
          borderRadius: 2,
          background: "linear-gradient(to right, #3b82f6, #2563eb)",
        }}
        disabled={loading}
        onSubmit={handleSubmit}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
      </Button>
    </Box>
  );
}
