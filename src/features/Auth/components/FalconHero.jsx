import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FalconHero() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // Subtle parallax calculation normalized from -1 to 1
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 2;
    const y = ((clientY - top) / height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden py-12 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 select-none"
      style={{
        background: "linear-gradient(170deg, #F4F8FF 0%, #EDF4FF 40%, #DCEBFF 85%, #F4F8FF 100%)",
      }}
    >
      {/* ── Background Subtle Light Reflections & Glow Orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-60"
          style={{
            background: "radial-gradient(circle, #A8CCFF 0%, rgba(220,235,255,0.2) 70%, transparent 100%)",
            transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`,
            transition: "transform 0.4s ease-out",
          }}
        />
        <div
          className="absolute top-1/2 -right-40 w-[480px] h-[480px] rounded-full blur-3xl opacity-50"
          style={{
            background: "radial-gradient(circle, #3478F6 0%, rgba(168,204,255,0.3) 50%, transparent 100%)",
            transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
            transition: "transform 0.5s ease-out",
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#123B75 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* ── Left Column: Headline, Description & Action Buttons ── */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#A8CCFF]/50 shadow-[0_2px_12px_rgba(52,120,246,0.08)] backdrop-blur-md mb-6 animate-fade-down">
            <span className="w-2 h-2 rounded-full bg-[#3478F6] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#1D5EDB]">
              Next-Gen Electronics Marketplace
            </span>
          </div>

          {/* Large Animated Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#123B75] tracking-tight leading-[1.12] mb-6">
            Discover Technology. <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #1D5EDB 0%, #3478F6 50%, #123B75 100%)",
              }}
            >
              Experience Smarter Shopping.
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-[#123B75]/80 max-w-xl font-normal leading-relaxed mb-8">
            Explore premium electronics, discover smarter deals and find your next device with FELCON.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate("/phones")}
              className="group relative px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#1D5EDB] to-[#3478F6] text-white font-bold text-sm sm:text-base shadow-[0_8px_25px_rgba(52,120,246,0.35)] hover:shadow-[0_12px_32px_rgba(52,120,246,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Products
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => navigate("/sell")}
              className="px-7 py-3.5 rounded-2xl bg-white/90 text-[#123B75] font-bold text-sm sm:text-base border-2 border-[#DCEBFF] hover:border-[#3478F6] hover:bg-[#F4F8FF] shadow-[0_4px_16px_rgba(18,59,117,0.06)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Start Selling &rarr;
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-10 pt-8 border-t border-[#DCEBFF]/70 w-full max-w-lg">
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-xl sm:text-2xl font-black text-[#123B75]">32-Point</span>
              <span className="text-xs text-[#123B75]/70 font-medium">Quality Checked</span>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-xl sm:text-2xl font-black text-[#3478F6]">6-Month</span>
              <span className="text-xs text-[#123B75]/70 font-medium">Assured Warranty</span>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-xl sm:text-2xl font-black text-[#1D5EDB]">Instant</span>
              <span className="text-xs text-[#123B75]/70 font-medium">Doorstep Payout</span>
            </div>
          </div>
        </div>

        {/* ── Right Column: 3D Floating Product Visuals & Glassmorphism Badges ── */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[360px] sm:min-h-[440px]">
          {/* Main 3D Composition Container */}
          <div
            className="relative w-full max-w-[420px] aspect-square flex items-center justify-center"
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 6}deg) rotateX(${mousePos.y * -6}deg)`,
              transition: "transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            {/* Center Glowing Disc */}
            <div
              className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-white/60 shadow-[0_20px_60px_rgba(52,120,246,0.18)]"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(220,235,255,0.4) 100%)",
                backdropFilter: "blur(12px)",
              }}
            />

            {/* Floating Smartphone Visual */}
            <div className="absolute z-20 w-44 sm:w-52 h-64 sm:h-72 rounded-3xl p-3 bg-white/95 border border-white shadow-[0_16px_40px_rgba(18,59,117,0.14)] flex flex-col items-center justify-between animate-float-slow">
              <div className="w-12 h-1 bg-[#DCEBFF] rounded-full mt-1" />
              <div className="flex-1 w-full my-2 rounded-2xl bg-gradient-to-b from-[#F4F8FF] to-[#EDF4FF] flex items-center justify-center p-2 overflow-hidden relative">
                <img
                  src="/products/iphone-15-pro-max.png"
                  alt="Apple iPhone 15 Pro"
                  className="w-auto h-36 object-contain filter drop-shadow-[0_8px_16px_rgba(52,120,246,0.2)]"
                  loading="eager"
                />
                <div className="absolute bottom-2 inset-x-2 py-1 px-2 rounded-lg bg-white/90 backdrop-blur-sm border border-white/60 text-[10px] font-bold text-[#123B75] text-center shadow-xs">
                  iPhone 15 Pro • 96% Health
                </div>
              </div>
              <div className="text-center pb-1">
                <span className="text-xs font-black text-[#123B75]">₹44,701</span>
                <span className="text-[10px] text-[#3478F6] font-bold ml-1.5">FALCON Assured</span>
              </div>
            </div>

            {/* Floating Laptop Visual (Top-Right) */}
            <div className="absolute -top-4 -right-2 sm:-right-4 z-30 w-36 sm:w-44 p-2.5 rounded-2xl bg-white/95 border border-white shadow-[0_12px_32px_rgba(52,120,246,0.16)] backdrop-blur-md animate-float-delayed">
              <div className="w-full h-20 rounded-xl bg-[#F4F8FF] border border-[#DCEBFF] p-1.5 flex items-center justify-center overflow-hidden">
                <img
                  src="/products/macbook-air-m2.png"
                  alt="MacBook Air M2"
                  className="h-full w-auto object-contain drop-shadow"
                  loading="lazy"
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[9px] font-bold text-[#123B75]">
                <span>MacBook Air M2</span>
                <span className="text-[#3478F6]">₹74,999</span>
              </div>
            </div>

            {/* Floating Smartwatch Visual (Bottom-Left) */}
            <div className="absolute -bottom-4 -left-2 sm:-left-4 z-30 w-36 sm:w-40 p-2.5 rounded-2xl bg-white/95 border border-white shadow-[0_12px_32px_rgba(52,120,246,0.16)] backdrop-blur-md animate-float-reverse">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#EDF4FF] border border-[#A8CCFF] p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src="/products/apple-watch-ultra-2.png"
                    alt="Apple Watch Ultra"
                    className="w-full h-full object-contain drop-shadow"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-[#123B75]">Apple Watch</p>
                  <p className="text-[9px] font-bold text-[#3478F6]">Trade-In Ready</p>
                </div>
              </div>
              <div className="mt-2 pt-1.5 border-t border-[#EDF4FF] text-[9px] font-semibold text-[#123B75]/70 flex justify-between">
                <span>Doorstep Pickup</span>
                <span className="text-[#1D5EDB] font-bold">Free</span>
              </div>
            </div>

            {/* Floating Glassmorphism Badge: Instant Valuation */}
            <div className="absolute top-1/2 -left-6 sm:-left-10 z-40 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-white/60 shadow-[0_8px_20px_rgba(52,120,246,0.12)] flex items-center gap-2 animate-bounce-subtle">
              <span className="w-2 h-2 rounded-full bg-[#3478F6]" />
              <span className="text-[11px] font-bold text-[#123B75]">
                ⚡ AI Valuation in 60s
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(-1.5deg); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(12px) rotate(1deg); }
        }
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-slow {
          animation: floatSlow 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: floatDelayed 7s ease-in-out infinite 1.5s;
        }
        .animate-float-reverse {
          animation: floatReverse 6.5s ease-in-out infinite 0.75s;
        }
        .animate-bounce-subtle {
          animation: bounceSubtle 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
