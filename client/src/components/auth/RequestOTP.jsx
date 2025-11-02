import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { requestOtp, setEmail } from "../../features/auth/authSlice";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  InputAdornment,
} from "@mui/material";

export default function RequestOTP() {
  const [inputEmail, setInputEmail] = useState("");
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setEmail(inputEmail));
    await dispatch(requestOtp(inputEmail));
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom right, #f9fafb, #e0f2fe)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 1,
      }}
    >
      <Paper
        elevation={5}
        sx={{ p: 5, borderRadius: 4, width: "100%", maxWidth: 400 }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(to bottom right, #3b82f6, #2563eb)",
            }}
          >
            <Sparkles size={28} color="white" />
          </Box>
          <Typography variant="h5" fontWeight="bold">
            Welcome Back
          </Typography>
          <Typography color="text.secondary">
            Enter your email to get started
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.2,
              mt: 2,
              borderRadius: 2,
              background: "linear-gradient(to right, #3b82f6, #2563eb)",
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </form>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 3 }}
        >
          We'll send you a one-time password to verify your email.
        </Typography>
      </Paper>
    </Box>
  );
}
