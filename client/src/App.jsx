import { useSelector } from "react-redux";
import Navbar from "./components/layout/NavBar";
import RequestOTP from "./components/auth/RequestOTP";
import OTPVerificationModal from "./components/auth/OTPVerificationModal";
import LoginForm from "./components/auth/LoginForm";
import Dashboard from "./components/layout/Dashboard";
import { Container } from "@mui/material";

export default function App() {
  const { step } = useSelector((state) => state.auth);

  const renderView = () => {
    switch (step) {
      case "requestOtp":
        return <RequestOTP />;
      case "verifyOtp":
        return <OTPVerificationModal />;
      case "login":
        return <LoginForm />;
      case "done":
        return <Dashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <Navbar />
      <Container sx={{ mt: 4, textAlign: "center" }}>{renderView()}</Container>
    </div>
  );
}
