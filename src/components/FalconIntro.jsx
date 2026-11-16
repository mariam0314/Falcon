import React, { useState, useEffect } from "react";

export default function FalconIntro({ onComplete }) {
  const [stage, setStage] = useState(0); // 0: enter, 1: text & tagline, 2: progress fill, 3: exit, 4: done
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user already saw intro this session
    const seen = sessionStorage.getItem("felcon_intro_seen") || sessionStorage.getItem("falcon_intro_seen");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || prefersReducedMotion) {
      if (onComplete) onComplete();
      return;
    }

    setVisible(true);

    // Timeline
    const t1 = setTimeout(() => setStage(1), 300);   // Logo scale-up & glow
    const t2 = setTimeout(() => setStage(2), 700);   // Tagline & Progress bar start
    
    // Smooth progress fill over ~1.6s
    let startTime = null;
    let animId = null;
    const duration = 1600;

    const animateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        animId = requestAnimationFrame(animateProgress);
      } else {
        // Finished fill
        setStage(3); // Fade out intro
        setTimeout(() => {
          sessionStorage.setItem("felcon_intro_seen", "true");
          setVisible(false);
          if (onComplete) onComplete();
        }, 550);
      }
    };

    const startProgressTimeout = setTimeout(() => {
      animId = requestAnimationFrame(animateProgress);
    }, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(startProgressTimeout);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem("felcon_intro_seen", "true");
    setVisible(false);
    if (onComplete) onComplete();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="FELCON Brand Introduction"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none transition-all duration-500 ease-out ${
        stage === 3 ? "opacity-0 scale-[1.03] pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{
        background: "radial-gradient(circle at center, #FFFFFF 0%, #EDF4FF 45%, #DCEBFF 100%)",
      }}
    >
      {/* Delicate floating background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="falcon-particle p-1" />
        <div className="falcon-particle p-2" />
        <div className="falcon-particle p-3" />
        <div className="falcon-particle p-4" />
        <div className="falcon-glow-orb" />
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-xs font-semibold tracking-wider uppercase text-[#123B75]/60 hover:text-[#3478F6] px-3 py-1.5 rounded-full border border-[#3478F6]/20 bg-white/70 backdrop-blur-md transition-all hover:bg-white"
      >
        Skip Intro &rarr;
      </button>

      {/* Centerpiece Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-md">
        
        {/* Logo Container with Royal Blue Glow */}
        <div className="relative mb-6">
          {/* Luminous Pulsing Glow */}
          <div
            className={`absolute -inset-4 rounded-3xl transition-all duration-1000 blur-2xl ${
              stage >= 1 ? "opacity-70 scale-110" : "opacity-0 scale-90"
            }`}
            style={{
              background: "radial-gradient(circle, rgba(52, 120, 246, 0.45) 0%, rgba(168, 204, 255, 0.2) 70%, transparent 100%)",
            }}
          />

          {/* Logo Card */}
          <div
            className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-4 bg-white/90 backdrop-blur-xl border border-white/80 shadow-[0_12px_40px_rgba(52,120,246,0.18)] flex items-center justify-center transition-all duration-700 ease-out ${
              stage >= 1 ? "scale-100 opacity-100 translate-y-0" : "scale-85 opacity-0 translate-y-4"
            }`}
          >
            <img
              src="/logo.png"
              alt="FELCON Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(52,120,246,0.25)]"
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1
          className={`text-3xl sm:text-4xl font-black tracking-wider transition-all duration-700 delay-100 ${
            stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{
            background: "linear-gradient(135deg, #0B1F3A 0%, #123B75 60%, #3478F6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.15em",
          }}
        >
          FELCON
        </h1>

        {/* Tagline */}
        <p
          className={`mt-2 text-xs sm:text-sm font-bold tracking-[0.22em] text-[#1D5EDB] uppercase transition-all duration-700 delay-200 ${
            stage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          BUY SMART. SELL BETTER.
        </p>

        {/* Sleek Progress Indicator */}
        <div
          className={`w-48 sm:w-56 h-1.5 bg-[#DCEBFF] rounded-full mt-7 overflow-hidden transition-all duration-500 ${
            stage >= 2 ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="h-full bg-gradient-to-r from-[#1D5EDB] via-[#3478F6] to-[#A8CCFF] rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(52,120,246,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="mt-2 text-[10px] font-semibold text-[#123B75]/50 tracking-widest uppercase">
          Initializing Marketplace
        </span>
      </div>

      <style>{`
        .falcon-glow-orb {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(52, 120, 246, 0.12) 0%, rgba(220, 235, 255, 0.05) 60%, transparent 100%);
          animation: orb-breathe 4s ease-in-out infinite alternate;
        }

        @keyframes orb-breathe {
          0% { transform: translate(-50%, -50%) scale(0.92); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        }

        .falcon-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #A8CCFF;
          opacity: 0.5;
          animation: particle-float 6s ease-in-out infinite alternate;
        }

        .falcon-particle.p-1 { top: 20%; left: 25%; animation-delay: 0s; width: 6px; height: 6px; }
        .falcon-particle.p-2 { top: 25%; right: 20%; animation-delay: 1.5s; width: 10px; height: 10px; background: #DCEBFF; }
        .falcon-particle.p-3 { bottom: 25%; left: 20%; animation-delay: 2.2s; width: 8px; height: 8px; }
        .falcon-particle.p-4 { bottom: 20%; right: 25%; animation-delay: 3s; width: 5px; height: 5px; }

        @keyframes particle-float {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-30px) scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
