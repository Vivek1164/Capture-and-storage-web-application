import { Box, Typography, Button } from "@mui/material";
import { CloudUpload } from "lucide-react";

export default function HeroSection({ onGetStarted }) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 2,
        px: 3,
        background:
          "linear-gradient(to bottom right, #eff6ff, #dbeafe, #bfdbfe)",
      }}
    >
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Seamless Media Management
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ maxWidth: "600px", mx: "auto", mb: 4 }}
      >
        Capture, upload, and manage your images & videos effortlessly — secure
        storage, instant access, and elegant design, all in one place.
      </Typography>

      <Button
        variant="contained"
        size="large"
        startIcon={<CloudUpload />}
        sx={{
          borderRadius: 3,
          background: "linear-gradient(to right, #3b82f6, #2563eb)",
          px: 4,
        }}
        onClick={onGetStarted}
      >
        Get Started
      </Button>
    </Box>
  );
}
