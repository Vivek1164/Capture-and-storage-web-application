import { Button } from "@mui/material";
import { Sparkles } from "lucide-react";
import { setStep, clearToken } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
  const dispatch = useDispatch();
  const { step } = useSelector((state) => state.auth);

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-linear-to-r from-white via-slate-50 to-blue-50 shadow-md sticky top-0 z-50 backdrop-blur-md">
      {/* Left Section - Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => dispatch(setStep("requestOtp"))}
      >
        <div className="p-2 bg-linear-to-br from-blue-500 to-blue-700 rounded-lg">
          <Sparkles className="text-white" size={20} />
        </div>
        <h1 className="text-lg font-semibold text-slate-800">
          Media Capture & Storage
        </h1>
      </div>

      {/* Right Section - Buttons */}
      <div className="flex gap-3">
        {step !== "done" ? (
          <Button
            variant="outlined"
            sx={{
              borderColor: "#2563eb",
              color: "#2563eb",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#2563eb", color: "#fff" },
            }}
            onClick={() => dispatch(setStep("login"))}
          >
            Login
          </Button>
        ) : (
          <Button
            variant="outlined"
            sx={{
              borderColor: "#2563eb",
              color: "#2563eb",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#2563eb", color: "#fff" },
            }}
            onClick={() => {
              dispatch(clearToken());
              dispatch(setStep("login"));
            }}
          >
            Log Out
          </Button>
        )}
        {/* <Button
          variant="contained"
          sx={{
            background: "linear-gradient(to right, #3b82f6, #2563eb)",
            fontWeight: 600,
            "&:hover": {
              background: "linear-gradient(to right, #2563eb, #1e40af)",
            },
          }}
        >
          Sign Up
        </Button> */}
      </div>
    </nav>
  );
}
