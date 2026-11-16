import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useCart } from "../../../context/cart.context";
import toast from "react-hot-toast";

export default function OtpGeneration() {
  const [otp, setOtp] = useState(["", "", "", ""]); // 4-digit OTP
  const [localErr, setLocalErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();

  const identifier =
    location.state?.identifier ||
    location.state?.phone ||
    location.state?.email ||
    "";
  const type =
    location.state?.type ||
    (identifier.includes("@") ? "email" : "mobile");
  const returnUrl = location.state?.returnUrl || null;
  const pendingCartFromState = location.state?.pendingCart || null;

  const {
    user,
    isAuthenticated,
    initializing,
    handleVerifyDemoOtp,
    handleSendDemoOtp,
    error: authError,
    clearError,
  } = useAuth();

  if (!initializing && isAuthenticated) {
    if (returnUrl) return <Navigate to={returnUrl} replace />;
    return <Navigate to="/" replace />;
  }

  if (!initializing && !identifier) {
    return <Navigate to="/login" replace />;
  }

  if (initializing) return <FullScreenSpinner />;

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setLocalErr("");
    if (authError) clearError();
    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    if (!pasted) return;
    const next = ["", "", "", ""];
    pasted.split("").forEach((char, i) => {
      if (i < 4) next[i] = char;
    });
    setOtp(next);
    inputs.current[Math.min(pasted.length, 3)]?.focus();
  };

  const executePendingCart = async () => {
    let pending = pendingCartFromState;
    if (!pending) {
      try {
        const stored = sessionStorage.getItem("falcon_pending_cart");
        if (stored) pending = JSON.parse(stored);
      } catch (_) {}
    }

    if (pending?.productId) {
      try {
        await addItem(pending.productId, pending.quantity || 1);
        sessionStorage.removeItem("falcon_pending_cart");
        toast.success(
          `Added "${pending.productTitle || "Product"}" to your cart!`,
          { duration: 4000 }
        );
        return pending.returnUrl || `/product/${pending.productId}`;
      } catch (err) {
        console.error("Auto add to cart error:", err);
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length < 4) {
      setLocalErr("Please enter the complete 4-digit demo verification code.");
      return;
    }

    if (otpValue !== "1234") {
      setLocalErr("Incorrect code. Demo verification code is 1234.");
      return;
    }

    setLocalErr("");
    setSubmitting(true);

    const res = await handleVerifyDemoOtp({
      identifier,
      type,
      otp: otpValue,
    });

    if (res?.success) {
      toast.success("Account verified successfully!");
      // Automatically continue pending Add to Cart action if user came from Add to Cart
      const cartReturnPath = await executePendingCart();
      setSubmitting(false);
      navigate(cartReturnPath || returnUrl || "/", { replace: true });
    } else {
      setSubmitting(false);
      setLocalErr(res?.error || "Verification failed. Please try again.");
    }
  };

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (resending || timer > 0) return;
    setTimer(60);
    setOtp(["", "", "", ""]);
    setLocalErr("");
    clearError();

    setResending(true);
    await handleSendDemoOtp({ identifier, type });
    setResending(false);
    inputs.current[0]?.focus();
    toast.success("Demo OTP regenerated: 1234");
  };

  const filled = otp.filter((d) => d !== "").length;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* ── Left panel ── */}
        <div className="hidden md:flex w-[35%] bg-gray-900 flex-col items-center justify-between p-10 relative overflow-hidden">
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
              alt="FALCON"
              className="w-9 h-9 object-contain rounded-xl shadow-sm"
            />
            <span className="text-white font-black text-base tracking-wider">
              FALCON
            </span>
          </div>

          {/* Center */}
          <div className="flex flex-col items-center z-10 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: "rgba(0,119,182,0.15)",
                border: "1px solid rgba(0,119,182,0.3)",
              }}
            >
              <svg
                className="w-8 h-8 text-[#5ab3d8]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">
              Verify &amp; Continue
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed max-w-[200px]">
              Fast and hassle-free demo verification. Enter the 4-digit code to continue.
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-col gap-2 w-full z-10">
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300">
              <span>⚡</span>
              <span>Fixed Demo OTP: <strong>1234</strong></span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300">
              <span>🛒</span>
              <span>Auto-adds pending item to cart</span>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="w-full md:w-[65%] p-8 md:p-12 flex flex-col justify-center bg-white">
          {/* Top nav */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate("/login", { replace: true })}
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
          <div className="mb-6 text-center sm:text-left">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3"
              style={{ background: "#e8f4fd", border: "1px solid #cce4f6" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#0077b6]" />
              <span className="text-xs font-semibold text-[#0077b6]">
                Demo Verification
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight mb-1">
              Verify Your Account
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-2">
              Enter the 4-digit demo verification code.
            </p>

            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700">
              <span className="text-gray-400">Verifying:</span>
              <span className="font-bold text-[#0077b6]">{identifier}</span>
              <span
                className="cursor-pointer hover:underline text-[10px] text-gray-400"
                onClick={() => navigate("/login", { replace: true })}
                title="Change identifier"
              >
                (Change)
              </span>
            </div>
          </div>

          {/* Prominent Demo Notice */}
          <div className="flex items-center justify-center gap-2 bg-[#e8f4fd] border border-[#bce0f5] text-[#0077b6] rounded-2xl px-4 py-3 mb-6 shadow-sm">
            <span className="text-base">💡</span>
            <span className="text-sm font-bold tracking-wide">
              Demo OTP: <span className="text-lg font-black underline tracking-widest text-[#005f8f]">1234</span>
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* 4-digit OTP inputs */}
            <div className="flex justify-center gap-3 sm:gap-4 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onPaste={handlePaste}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={submitting}
                  className="w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-black rounded-2xl border-2 focus:outline-none transition-all duration-200 disabled:opacity-60"
                  style={
                    digit
                      ? {
                          borderColor: "#0077b6",
                          background: "#e8f4fd",
                          color: "#005f8f",
                          boxShadow: "0 0 0 4px rgba(0,119,182,0.12)",
                        }
                      : {
                          borderColor: "#e5e7eb",
                          background: "#f9fafb",
                          color: "#1f2937",
                        }
                  }
                  onFocus={(e) => {
                    if (!digit) {
                      e.target.style.borderColor = "#0077b6";
                      e.target.style.background = "#fff";
                      e.target.style.boxShadow =
                        "0 0 0 4px rgba(0,119,182,0.08)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!digit) {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.background = "#f9fafb";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                />
              ))}
            </div>

            {/* Quick Fill Button */}
            <div className="text-center mb-4">
              <button
                type="button"
                onClick={() => {
                  setOtp(["1", "2", "3", "4"]);
                  setLocalErr("");
                }}
                className="text-xs text-[#0077b6] hover:underline font-semibold"
              >
                Auto-fill demo OTP (1234)
              </button>
            </div>

            {/* Error Display */}
            {(localErr || authError) && (
              <p className="text-red-500 text-xs mb-4 flex items-center justify-center gap-1.5 font-medium bg-red-50 py-2 px-3 rounded-xl border border-red-200">
                <svg
                  className="w-3.5 h-3.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {localErr || authError}
              </p>
            )}

            {/* Verify button */}
            <button
              type="submit"
              disabled={submitting || filled < 4}
              className="w-full py-4 rounded-2xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
              style={
                !submitting && filled === 4
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
                if (!submitting && filled === 4) {
                  e.currentTarget.style.background = "#005f8f";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 18px rgba(0,119,182,0.35)";
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting && filled === 4) {
                  e.currentTarget.style.background = "#0077b6";
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow =
                    "0 4px 14px rgba(0,119,182,0.3)";
                }
              }}
            >
              {submitting && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {submitting ? "Verifying OTP…" : "Verify OTP"}
              {!submitting && filled === 4 && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              )}
            </button>
          </form>

          {/* Resend */}
          <p className="text-xs text-gray-400 text-center mt-6">
            {timer > 0 ? (
              <>
                Resend code in{" "}
                <span className="font-bold text-gray-700">{timer}s</span>
              </>
            ) : (
              <>
                Didn't receive code?{" "}
                <span
                  onClick={handleResend}
                  className={`font-bold ${
                    resending
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#0077b6] cursor-pointer hover:underline"
                  }`}
                >
                  {resending ? "Sending…" : "Resend Demo Code"}
                </span>
              </>
            )}
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
