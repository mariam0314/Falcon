import React, { useState, useRef } from "react";

export default function Feedback() {
  const [mobileIndex, setMobileIndex] = useState(0);
  const touchStartX = useRef(null);

  const metrics = [
    { label: "₹13,052+ Cr. Instant Payouts", desc: "Transferred securely to user bank accounts" },
    { label: "193+ Lac Gadgets Encashed", desc: "Certified and traded through FALCON" },
  ];

  const feedback = [
    { name: "Karan Sharma", location: "Delhi NCR", text: "Well trained staff. Overall a positive experience in selling my phone at FALCON." },
    { name: "Abhiyash", location: "New Delhi", text: "No complaints, sold my phone very easily here. Definitely worth a try." },
    { name: "Vinit Kumar", location: "New Delhi", text: "Payment was very instant and the whole process was quick. Will recommend it." },
    { name: "Satheesh Kumaram", location: "Bengaluru", text: "It was a wonderful experience with FALCON. I got a reasonable price and their response was very quick!" },
  ];

  const next = () => { if (mobileIndex < feedback.length - 1) setMobileIndex(mobileIndex + 1); };
  const prev = () => { if (mobileIndex > 0) setMobileIndex(mobileIndex - 1); };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) next();
    else if (diff < -40) prev();
    touchStartX.current = null;
  };

  return (
    <section className="bg-gradient-to-b from-[#F4F8FF] via-white to-[#EDF4FF] text-[#123B75] px-4 md:px-6 py-12 md:py-16 border-t border-[#DCEBFF]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#3478F6] bg-[#EDF4FF] px-3.5 py-1 rounded-full border border-[#DCEBFF]">
            Customer Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#123B75] mt-3">
            Trusted by <span className="text-[#3478F6]">174+ Lac</span> Happy Customers
          </h2>
          <p className="text-sm text-[#123B75]/70 mt-2">
            Real feedback from buyers and sellers across 40+ Indian cities.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white border border-[#DCEBFF] rounded-2xl p-5 text-center shadow-[0_4px_16px_rgba(52,120,246,0.06)]"
            >
              <p className="font-black text-lg sm:text-xl text-[#123B75]">{metric.label}</p>
              <p className="text-xs text-[#123B75]/60 mt-1">{metric.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
            >
              {feedback.map((t, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <div className="bg-white rounded-2xl p-6 shadow-[0_8px_24px_rgba(52,120,246,0.08)] border border-[#DCEBFF]">
                    <div className="flex gap-1 text-[#3478F6] mb-3">
                      {"★".repeat(5)}
                    </div>
                    <p className="text-sm italic text-[#123B75]/80 mb-4">"{t.text}"</p>
                    <p className="font-bold text-[#1D5EDB]">{t.name}</p>
                    <p className="text-xs text-[#123B75]/50">{t.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              disabled={mobileIndex === 0}
              className="bg-white border border-[#DCEBFF] rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-30 text-[#123B75] shadow-sm hover:border-[#3478F6]"
            >
              ←
            </button>
            <div className="flex gap-2">
              {feedback.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMobileIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    mobileIndex === i ? "bg-[#3478F6] w-5" : "bg-[#DCEBFF] w-2"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              disabled={mobileIndex === feedback.length - 1}
              className="bg-white border border-[#DCEBFF] rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-30 text-[#123B75] shadow-sm hover:border-[#3478F6]"
            >
              →
            </button>
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
          {feedback.map((t, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-[0_8px_24px_rgba(52,120,246,0.06)] border border-[#DCEBFF] hover:border-[#3478F6] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-[#3478F6] mb-3 text-sm">
                  {"★".repeat(5)}
                </div>
                <p className="text-sm italic text-[#123B75]/85 mb-6">"{t.text}"</p>
              </div>
              <div className="pt-4 border-t border-[#EDF4FF]">
                <p className="font-extrabold text-[#1D5EDB] text-sm">{t.name}</p>
                <p className="text-xs text-[#123B75]/50 mt-0.5">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
