// Login.jsx

import React, { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Login() {
  const [authType, setAuthType] = useState("email"); // 'email' | 'mobile'
  const [identifier, setIdentifier] = useState("");
  const [sending, setSending] = useState(false);
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get("redirect") || location.state?.returnUrl || null;
  const pendingCart = location.state?.pendingCart || null;

  const {
    user,
    isAuthenticated,
    initializing,
    handleSendDemoOtp,
    handleGoogleAuth,
    error: authError,
    clearError,
  } = useAuth();

  if (!initializing && isAuthenticated) {
    if (redirectUrl) return <Navigate to={redirectUrl} replace />;
    if (user?.role === "admin") return <Navigate to="/admin-dashboard" replace />;
    if (user?.role === "seller") return <Navigate to="/seller-dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  if (initializing) return <FullScreenSpinner />;

  // Email format validation
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  // Mobile format validation (10 digits)
  const validateMobile = (v) => v.replace(/\D/g, "").length === 10;

  const isValid =
    authType === "email" ? validateEmail(identifier) : validateMobile(identifier);

  const handleInputChange = (e) => {
    setLocalError("");
    if (authError) clearError();
    if (authType === "mobile") {
      const v = e.target.value.replace(/\D/g, "").slice(0, 10);
      setIdentifier(v);
    } else {
      setIdentifier(e.target.value);
    }
  };

  const handleContinue = async () => {
    if (!isValid || sending) return;
    setSending(true);
    setLocalError("");

    let normalizedId = identifier.trim();
    if (authType === "mobile") {
      normalizedId = normalizedId.startsWith("+") ? normalizedId : `+91${normalizedId}`;
    }

    const result = await handleSendDemoOtp({
      identifier: normalizedId,
      type: authType,
    });

    setSending(false);

    if (result?.success) {
      navigate("/otp", {
        state: {
          identifier: normalizedId,
          type: authType,
          returnUrl: redirectUrl,
          pendingCart,
          otpTarget: "login",
        },
      });
    } else {
      setLocalError(result?.error || "Failed to initiate login. Please try again.");
    }
  };

  // ── Google handler ─────────────────────────────────────────────────────────
  const handleGoogleSuccess = async (credential) => {
    const result = await handleGoogleAuth(credential);
    if (result?.success) {
      if (result.requiresMobile) {
        navigate("/", { state: { requiresMobile: true }, replace: true });
        return;
      }
      if (redirectUrl) {
        navigate(redirectUrl, { replace: true });
        return;
      }
      const role = result.user?.role;
      if (role === "admin") navigate("/admin-dashboard", { replace: true });
      else if (role === "seller") navigate("/seller-dashboard", { replace: true });
      else navigate("/", { replace: true });
    }
  };

  const handleGoogleError = (message) => {
    console.error("[Login] Google error:", message);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50 p-4"
      onClick={() => navigate(-1)}
    >
      <div
        className="flex flex-col md:flex-row w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Left panel ── */}
        <div className="hidden md:flex w-1/2 bg-gray-900 flex-col items-center justify-between p-10 relative overflow-hidden">
          <div
            className="absolute -top-16 -left-16 w-64 h-64 rounded-full"
            style={{ background: "rgba(0,119,182,0.1)" }}
          />
          <div
            className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full"
            style={{ background: "rgba(0,119,182,0.1)" }}
          />

          {/* Logo */}
          <div className="w-full flex items-center gap-2 z-10">
            <img
              src="/logo.png"
              alt="FELCON"
              className="w-9 h-9 object-contain rounded-xl shadow-sm"
            />
            <span className="text-white font-black text-base tracking-wider">
              FELCON
            </span>
          </div>

          {/* Center text */}
          <div className="flex flex-col items-center z-10">
            <h3 className="text-white text-xl font-bold text-center leading-snug mb-2">
              Welcome to
              <br />
              FELCON
            </h3>
            <p className="text-gray-400 text-xs text-center leading-relaxed max-w-[220px]">
              {pendingCart
                ? `Sign in to add "${pendingCart.productTitle || "product"}" to your cart.`
                : "Explore authentic mobile phones and laptops with real specs and pricing."}
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-col gap-2 w-full z-10">
            {[
              { icon: "⚡", label: "Instant Demo OTP: 1234" },
              { icon: "🔒", label: "100% Secure Authentication" },
              { icon: "🛒", label: "Seamless Add to Cart Flow" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2"
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-gray-300 text-xs font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white">
          {/* Top nav */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors font-semibold"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 transition-all"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Heading */}
          <div className="mb-5">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3"
              style={{ background: "#e8f4fd", border: "1px solid #cce4f6" }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#0077b6" }}
              />
              <span
                className="text-xs font-semibold"
                style={{ color: "#0077b6" }}
              >
                Demo OTP Sign In
              </span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight mb-1">
              Sign in to FELCON
            </h2>
            <p className="text-xs text-gray-400">
              Select your preferred login method below
            </p>
          </div>

          {/* ── Two Login Options: Tabs ── */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-4">
            <button
              type="button"
              onClick={() => {
                setAuthType("email");
                setIdentifier("");
                setLocalError("");
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authType === "email"
                  ? "bg-white text-[#0077b6] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Continue with Email
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthType("mobile");
                setIdentifier("");
                setLocalError("");
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authType === "mobile"
                  ? "bg-white text-[#0077b6] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Continue with Mobile
            </button>
          </div>

          {/* ── Input Field ── */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
              {authType === "email" ? "Email Address" : "Mobile Number"}
            </label>

            {authType === "email" ? (
              <div
                className={`flex items-center border rounded-2xl px-4 py-3 transition-all duration-200 ${
                  identifier && !isValid ? "border-red-300 bg-red-50/50" : ""
                }`}
                style={
                  identifier && isValid
                    ? { borderColor: "#0077b6", background: "rgba(0,119,182,0.03)" }
                    : !identifier
                    ? { borderColor: "#e5e7eb", background: "#f9fafb" }
                    : {}
                }
              >
                <input
                  type="email"
                  value={identifier}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                  placeholder="name@example.com"
                  disabled={sending}
                  className="flex-1 bg-transparent focus:outline-none text-sm text-gray-800 placeholder-gray-400 font-medium disabled:opacity-60"
                />
                {isValid && !sending && (
                  <svg
                    className="w-4 h-4 flex-shrink-0 text-[#0077b6]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            ) : (
              <div
                className={`flex items-center border rounded-2xl px-4 py-3 transition-all duration-200 ${
                  identifier && !isValid ? "border-red-300 bg-red-50/50" : ""
                }`}
                style={
                  identifier && isValid
                    ? { borderColor: "#0077b6", background: "rgba(0,119,182,0.03)" }
                    : !identifier
                    ? { borderColor: "#e5e7eb", background: "#f9fafb" }
                    : {}
                }
              >
                <span className="text-sm mr-2 text-gray-500 font-medium select-none">
                  +91
                </span>
                <input
                  type="tel"
                  value={identifier}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                  placeholder="9876543210"
                  disabled={sending}
                  className="flex-1 bg-transparent focus:outline-none text-sm text-gray-800 placeholder-gray-400 font-medium disabled:opacity-60"
                />
                {isValid && !sending && (
                  <svg
                    className="w-4 h-4 flex-shrink-0 text-[#0077b6]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            )}

            {/* Validation & Error hints */}
            {identifier && !isValid && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1.5 font-medium">
                {authType === "email"
                  ? "Enter a valid email format (e.g. user@domain.com)"
                  : "Enter a valid 10-digit mobile number"}
              </p>
            )}

            {(localError || authError) && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1.5 font-medium">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {localError || authError}
              </p>
            )}

            <p className="text-[11px] text-gray-400 mt-2">
              💡 Demo Mode: Enter any valid {authType === "email" ? "email" : "mobile number"}. Demo OTP is <strong className="text-gray-700">1234</strong>.
            </p>
          </div>

          {/* Continue button */}
          <button
            disabled={!isValid || sending}
            onClick={handleContinue}
            className="w-full py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
            style={
              isValid && !sending
                ? {
                    background: "#0077b6",
                    color: "#fff",
                    boxShadow: "0 4px 14px rgba(0,119,182,0.3)",
                  }
                : {
                    background: "#f3f4f6",
                    color: "#9ca3af",
                    cursor: "not-allowed",
                  }
            }
            onMouseEnter={(e) => {
              if (isValid && !sending) {
                e.currentTarget.style.background = "#005f8f";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,119,182,0.35)";
              }
            }}
            onMouseLeave={(e) => {
              if (isValid && !sending) {
                e.currentTarget.style.background = "#0077b6";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,119,182,0.3)";
              }
            }}
          >
            {sending && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {sending ? "Sending Code…" : "Continue"}
            {isValid && !sending && (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">
              or continue with Google
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Sign-In */}
          <div className="mb-2">
            <GoogleAuthButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              label="Sign in with Google"
              disabled={sending}
            />
          </div>

          {/* Terms */}
          <p className="text-[11px] text-gray-400 text-center mt-4">
            By continuing, you agree to FELCON's{" "}
            <span className="text-gray-600 font-semibold underline cursor-pointer">
              Terms
            </span>{" "}
            &amp;{" "}
            <span className="text-gray-600 font-semibold underline cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function FullScreenSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div
        className="w-8 h-8 rounded-full animate-spin"
        style={{
          border: "3px solid rgba(0,119,182,0.15)",
          borderTopColor: "#0077b6",
        }}
      />
    </div>
  );
}
