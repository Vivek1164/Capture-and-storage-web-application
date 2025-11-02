import { useState } from "react";
import { X, ShieldCheck, User, Lock, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../../features/auth/authSlice.js";

export default function OTPVerificationModal({ onClose, onSuccess }) {
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const { email, loading, error } = useSelector((state) => state.auth);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!otp.trim() || otp.length !== 6) {
      setLocalError("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!name.trim() || name.length < 3) {
      setLocalError("Please enter your full name (min. 3 characters).");
      return;
    }

    if (!password || password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    const res = await dispatch(verifyOtp({ email, otp, name, password }));

    if (!res.error) {
      onSuccess();
    }
  };

  return (
    <div className="  flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        ></button>

        <div className="p-8">
          <div className="flex mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Verify Your Account
            </h2>
            <p className="text-slate-600 text-sm">
              We sent a code to{" "}
              <span className="font-medium text-slate-800">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                OTP
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center text-2xl tracking-widest font-semibold"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email-display"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email-display"
                  placeholder="youremail@gmail.com"
                  type="email"
                  disabled
                  value={email}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {(localError || error) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {localError || error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-500 to-emerald-400 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
            >
              {loading ? "Verifying..." : "Complete Registration"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <button
              onClick={onClose}
              className="text-sm text-slate-600 hover:text-slate-800 transition-colors w-full text-center"
            >
              Didn’t receive the code? Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
