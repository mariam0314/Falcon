import React from "react";

export default function DownloadAppBanner() {
  return (
    <section className="mx-4 md:mx-12 mb-12 rounded-3xl p-8 md:p-12 bg-gradient-to-r from-[#123B75] via-[#1D5EDB] to-[#3478F6] text-white shadow-[0_16px_40px_rgba(18,59,117,0.22)] relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#A8CCFF]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 relative z-10">
        
        {/* Left: Text + Store Buttons */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest uppercase mb-4">
            <span>📱</span> Mobile Experience
          </div>

          <h2 className="text-3xl md:text-4xl font-black mb-3 leading-tight tracking-tight">
            Download the FALCON App
          </h2>

          <p className="text-sm md:text-base text-white/85 mb-6 max-w-lg leading-relaxed">
            Sell your old smartphone in 60 seconds • Buy certified refurbished electronics • Instant doorstep pickups & verified payouts.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center">
            {/* Google Play Button */}
            <a
              href="https://play.google.com/store/apps/details?id=com.falcon.marketplace"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/95 text-[#123B75] font-bold text-xs sm:text-sm shadow-md hover:bg-white hover:scale-105 transition-all"
            >
              <span className="text-xl">▶</span>
              <div className="text-left leading-tight">
                <span className="block text-[10px] uppercase font-semibold text-gray-500">GET IT ON</span>
                <span>Google Play</span>
              </div>
            </a>

            {/* App Store Button */}
            <a
              href="https://apps.apple.com/in/app/falcon/id123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/95 text-[#123B75] font-bold text-xs sm:text-sm shadow-md hover:bg-white hover:scale-105 transition-all"
            >
              <span className="text-xl"></span>
              <div className="text-left leading-tight">
                <span className="block text-[10px] uppercase font-semibold text-gray-500">Download on</span>
                <span>App Store</span>
              </div>
            </a>
          </div>
        </div>

        {/* Right: Phone Frame with Logo Visual */}
        <div className="flex-1 flex justify-center">
          <div className="w-56 sm:w-64 rounded-3xl p-3.5 bg-white/15 backdrop-blur-xl border border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col items-center">
            <div className="w-12 h-1 bg-white/40 rounded-full mb-3" />
            <div className="w-full aspect-[9/16] rounded-2xl bg-white p-4 flex flex-col items-center justify-between shadow-inner">
              <div className="w-full flex justify-between items-center text-[10px] font-bold text-[#123B75]">
                <span>9:41</span>
                <span>5G 🔋</span>
              </div>
              <div className="flex flex-col items-center text-center my-auto">
                <div className="w-16 h-16 rounded-2xl p-2 bg-[#F4F8FF] border border-[#DCEBFF] shadow-md flex items-center justify-center mb-2">
                  <img
                    src="/logo.png"
                    alt="FALCON App"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h4 className="text-sm font-black text-[#123B75]">FALCON</h4>
                <p className="text-[10px] font-bold text-[#3478F6]">BUY SMART. SELL BETTER.</p>
              </div>
              <div className="w-full py-2 rounded-xl bg-gradient-to-r from-[#1D5EDB] to-[#3478F6] text-white text-[11px] font-bold text-center shadow-md">
                Get Instant Quote
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}