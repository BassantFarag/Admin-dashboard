import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      await login(formData.email.trim(), formData.password);
      navigate("/", { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.response?.data?.error || "Invalid email or password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

const BrandShape = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 500 900"
    preserveAspectRatio="xMidYMid slice"
    className="absolute inset-0 h-full w-full"
  >
    <rect x="0" y="0" width="500" height="900" fill={darkMode ? "#12130f" : "#f3e6c8"} />

    {/* Overlapping triangle/origami shapes */}
    <polygon points="0,0 500,0 250,260 0,520" fill={darkMode ? "#4a3a12" : "#f6d98a"} opacity="0.9" />
    <polygon points="0,0 250,260 0,520" fill={darkMode ? "#6b5218" : "#f0c866"} />
    <polygon points="0,520 250,260 500,520 250,780" fill={darkMode ? "#3a2c0e" : "#eec24f"} opacity="0.85" />
    <polygon points="0,520 250,780 0,1040" fill={darkMode ? "#5c4614" : "#e8b93d"} />
    <polygon points="0,780 250,780 0,1040" fill={darkMode ? "#332608" : "#dcae33"} />
  </svg>
);
  return (
    <div className={`flex min-h-screen w-full flex-col lg:flex-row ${darkMode ? "bg-[#0d0e10]" : "bg-[#fbf6ec]"}`}>
      {/* Brand panel — small strip on mobile, full side panel on desktop */}
      <div className="relative h-40 w-full overflow-hidden sm:h-52 lg:h-auto lg:w-[42%]">
        <BrandShape />

        <button
          type="button"
          onClick={() => setError("Sign up is not available yet.")}
          className={`absolute left-6 top-1/2 -translate-y-1/2 text-lg font-bold tracking-wide sm:left-8 sm:text-xl lg:left-10 lg:text-2xl ${
            darkMode ? "text-[#e3b158]" : "text-[#7a5a12]"
          }`}
        >
          SIGN UP
        </button>
      </div>

      {/* Form panel */}
      <div className="relative flex w-full flex-1 flex-col items-center justify-center px-6 py-10 lg:w-[58%] lg:py-12">
        {/* Dark/Light toggle */}
        <button
          type="button"
          onClick={() => setDarkMode((prev) => !prev)}
          aria-label="Toggle theme"
          className={`absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border transition ${
            darkMode
              ? "border-white/10 bg-white/5 text-[#e3b158] hover:bg-white/10"
              : "border-black/10 bg-black/5 text-[#b88322] hover:bg-black/10"
          }`}
        >
          {darkMode ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <div className="w-full max-w-sm">
          {/* Avatar circle */}
          <div className="mb-5 flex justify-center">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full ${
                darkMode ? "bg-[#e3b158]" : "bg-[#d9a441]"
              }`}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#161719" strokeWidth="1.6">
                <circle cx="12" cy="8" r="3.4" />
                <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <h1
            className={`mb-8 text-center text-2xl font-bold tracking-wide ${
              darkMode ? "text-[#e3b158]" : "text-[#b88322]"
            }`}
          >
            LOGIN
          </h1>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2.5 text-xs text-danger">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <div
                className={`flex items-center gap-3 rounded-lg border-b px-3 py-2.5 ${
                  darkMode ? "border-white/15 bg-black" : "border-black/15"
                }`}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={darkMode ? "text-[#8a8a86]" : "text-[#8a7a55]"}
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  autoComplete="email"
                  className={`w-full bg-transparent text-sm outline-none ${
                    darkMode ? "text-white placeholder:text-[#7a7a77]" : "text-[#1a1b1d] placeholder:text-[#9a8a5f]"
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-8">
              <div
                className={`flex items-center gap-3 rounded-lg border-b px-3 py-2.5 ${
                  darkMode ? "border-white/15 bg-black" : "border-black/15"
                }`}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={darkMode ? "text-[#8a8a86]" : "text-[#8a7a55]"}
                >
                  <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M8 10V7.5C8 5.29 9.79 3.5 12 3.5C14.21 3.5 16 5.29 16 7.5V10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  autoComplete="current-password"
                  className={`w-full bg-transparent text-sm outline-none ${
                    darkMode ? "text-white placeholder:text-[#7a7a77]" : "text-[#1a1b1d] placeholder:text-[#9a8a5f]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={`shrink-0 text-xs font-medium ${
                    darkMode ? "text-[#8a8a86] hover:text-white" : "text-[#8a7a55] hover:text-[#1a1b1d]"
                  }`}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Forgot + Submit */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setError("Password reset is not available yet.")}
                className={`text-xs font-bold ${
                  darkMode ? "text-[#e3b158] hover:text-[#d9a441]" : "text-[#b88322] hover:text-[#d9a441]"
                }`}
              >
                Forgot password?
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`flex h-11 items-center justify-center rounded-full px-8 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  darkMode
                    ? "bg-[#e3b158] text-[#161719] hover:bg-[#d9a441]"
                    : "bg-[#b88322] text-white hover:bg-[#d9a441]"
                }`}
              >
                {loading ? (
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                    <path d="M21 12C21 7.03 16.97 3 12 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : (
                  "LOGIN"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;