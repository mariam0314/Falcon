import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FalconShowcaseSections() {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-16 md:space-y-24 py-8 select-none">
      
      {/* ════════════════════════════════════════════════════════════════════════
          SECTION A: FEATURED ELECTRONICS
          Large, beautiful images of smartphones, laptops and accessories.
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#3478F6] bg-[#EDF4FF] px-3.5 py-1 rounded-full border border-[#DCEBFF]">
            Curated Catalog
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#123B75] tracking-tight mt-3">
            Featured Electronics
          </h2>
          <p className="text-sm sm:text-base text-[#123B75]/70 mt-2">
            Handpicked, certified premium devices with manufacturer-grade testing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Flagship Smartphones */}
          <div
            onClick={() => navigate("/phones")}
            className="group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-[#F4F8FF] to-[#EDF4FF] border border-[#DCEBFF] shadow-[0_8px_30px_rgba(52,120,246,0.06)] hover:shadow-[0_16px_40px_rgba(52,120,246,0.18)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A8CCFF]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div>
              <span className="text-xs font-bold text-[#1D5EDB] uppercase tracking-wider">Premium Series</span>
              <h3 className="text-2xl font-black text-[#123B75] mt-1 group-hover:text-[#3478F6] transition-colors">
                Flagship Mobiles
              </h3>
              <p className="text-xs sm:text-sm text-[#123B75]/70 mt-2">
                Apple, Samsung, OnePlus with 32-point diagnostics and warranty.
              </p>
            </div>
            <div className="my-8 flex justify-center items-center h-48 relative">
              <div className="w-36 h-36 rounded-full bg-[#DCEBFF]/50 absolute blur-lg group-hover:bg-[#A8CCFF]/60 transition-colors" />
              <img
                src="/products/iphone-15-pro-max.png"
                alt="Flagship Mobiles"
                className="max-h-40 w-auto object-contain z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(52,120,246,0.25)]"
                loading="lazy"
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#DCEBFF]/60">
              <span className="text-xs font-bold text-[#123B75]">From ₹14,999</span>
              <span className="text-xs font-bold text-[#3478F6] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Explore Mobiles &rarr;
              </span>
            </div>
          </div>

          {/* Card 2: Laptops & Workstations */}
          <div
            onClick={() => navigate("/laptops")}
            className="group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-[#F4F8FF] to-[#EDF4FF] border border-[#DCEBFF] shadow-[0_8px_30px_rgba(52,120,246,0.06)] hover:shadow-[0_16px_40px_rgba(52,120,246,0.18)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3478F6]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div>
              <span className="text-xs font-bold text-[#1D5EDB] uppercase tracking-wider">Performance</span>
              <h3 className="text-2xl font-black text-[#123B75] mt-1 group-hover:text-[#3478F6] transition-colors">
                Laptops & Macs
              </h3>
              <p className="text-xs sm:text-sm text-[#123B75]/70 mt-2">
                MacBook Air, Dell XPS, ThinkPad verified for battery health & thermals.
              </p>
            </div>
            <div className="my-8 flex justify-center items-center h-48 relative">
              <div className="w-36 h-36 rounded-full bg-[#DCEBFF]/50 absolute blur-lg group-hover:bg-[#A8CCFF]/60 transition-colors" />
              <img
                src="/products/macbook-air-m2.png"
                alt="Laptops & Macs"
                className="max-h-40 w-auto object-contain z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(52,120,246,0.25)]"
                loading="lazy"
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#DCEBFF]/60">
              <span className="text-xs font-bold text-[#123B75]">From ₹24,999</span>
              <span className="text-xs font-bold text-[#3478F6] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Explore Laptops &rarr;
              </span>
            </div>
          </div>

          {/* Card 3: Wearables & Audio */}
          <div
            onClick={() => navigate("/smartwatches")}
            className="group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-[#F4F8FF] to-[#EDF4FF] border border-[#DCEBFF] shadow-[0_8px_30px_rgba(52,120,246,0.06)] hover:shadow-[0_16px_40px_rgba(52,120,246,0.18)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A8CCFF]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            <div>
              <span className="text-xs font-bold text-[#1D5EDB] uppercase tracking-wider">Lifestyle</span>
              <h3 className="text-2xl font-black text-[#123B75] mt-1 group-hover:text-[#3478F6] transition-colors">
                Wearables & Audio
              </h3>
              <p className="text-xs sm:text-sm text-[#123B75]/70 mt-2">
                Smartwatches, premium ANC headphones, and certified tech accessories.
              </p>
            </div>
            <div className="my-8 flex justify-center items-center h-48 relative">
              <div className="w-36 h-36 rounded-full bg-[#DCEBFF]/50 absolute blur-lg group-hover:bg-[#A8CCFF]/60 transition-colors" />
              <img
                src="/products/apple-watch-ultra-2.png"
                alt="Smartwatches & Wearables"
                className="max-h-36 w-auto object-contain z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_10px_20px_rgba(52,120,246,0.25)]"
                loading="lazy"
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#DCEBFF]/60">
              <span className="text-xs font-bold text-[#123B75]">From ₹3,499</span>
              <span className="text-xs font-bold text-[#3478F6] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Explore Wearables &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION B: TRENDING DEVICES (Horizontally Animated Showcase)
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#EDF4FF]/50 py-12 border-y border-[#DCEBFF]/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#3478F6]">Live Marketplace</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123B75]">Trending This Week</h2>
          </div>
          <button
            onClick={() => navigate("/phones")}
            className="text-xs sm:text-sm font-bold text-[#3478F6] hover:text-[#1D5EDB] flex items-center gap-1"
          >
            View All Deals &rarr;
          </button>
        </div>

        {/* Marquee Ticker */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-4">
          {[
            { name: "iPhone 15 Pro Max", tag: "Superb", price: "₹1,14,999", off: "28% OFF", chip: "A17 Pro", image: "/products/iphone-15-pro-max.png" },
            { name: "Samsung Galaxy S24 Ultra", tag: "Superb", price: "₹99,999", off: "29% OFF", chip: "Snapdragon 8 Gen 3", image: "/products/samsung-s24-ultra.png" },
            { name: "OnePlus 12 5G", tag: "Good", price: "₹52,999", off: "18% OFF", chip: "12GB RAM", image: "/products/oneplus-12.png" },
            { name: "MacBook Air M2", tag: "Superb", price: "₹74,999", off: "25% OFF", chip: "256GB SSD", image: "/products/macbook-air-m2.png" },
            { name: "Dell XPS 15 9530", tag: "Good", price: "₹1,19,999", off: "31% OFF", chip: "i7-13700H", image: "/products/dell-xps-15.png" },
            { name: "iPhone 13", tag: "Good", price: "₹38,999", off: "35% OFF", chip: "128GB", image: "/products/iphone-13.png" },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate("/phones")}
              className="flex-shrink-0 w-64 sm:w-72 p-4 rounded-2xl bg-white border border-[#DCEBFF] shadow-[0_4px_16px_rgba(52,120,246,0.06)] hover:shadow-[0_12px_28px_rgba(52,120,246,0.16)] hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDF4FF] text-[#1D5EDB] border border-[#A8CCFF]/50">
                  {item.tag}
                </span>
                <span className="text-[10px] font-extrabold text-[#3478F6]">{item.off}</span>
              </div>
              <div className="h-28 w-full flex items-center justify-center p-2 mb-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-h-24 w-auto object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h4 className="text-sm font-extrabold text-[#123B75] line-clamp-1">{item.name}</h4>
              <p className="text-[11px] text-[#123B75]/60 mt-0.5">{item.chip}</p>
              <div className="mt-3 pt-2.5 border-t border-[#EDF4FF] flex items-center justify-between">
                <span className="text-base font-black text-[#123B75]">{item.price}</span>
                <span className="text-[11px] font-bold text-[#3478F6]">Buy Now &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION C: SMART SHOPPING & FALCON AI
          Illustrative visuals for AI pricing, comparison, and smart insights.
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Visual Side: Futuristic AI Matrix */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-[#123B75] via-[#1D5EDB] to-[#3478F6] text-white shadow-[0_16px_40px_rgba(18,59,117,0.25)] overflow-hidden">
            {/* Luminous Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#A8CCFF]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest uppercase mb-6">
                <span>🤖</span> FALCON AI Engine
              </div>

              <h3 className="text-2xl sm:text-3xl font-black leading-snug mb-4">
                Real-Time Algorithmic Valuation & Smart Matching
              </h3>
              <p className="text-sm text-white/85 leading-relaxed mb-6">
                Our dynamic neural pricing analyzes 40+ hardware parameters, screen health, and current market demand to guarantee the highest value for your old device.
              </p>

              {/* Live Metric Pills */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <span className="text-xl font-black">60 Secs</span>
                  <p className="text-[11px] text-white/70 mt-0.5">Instant Automated Quote</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <span className="text-xl font-black">₹0 Deductions</span>
                  <p className="text-[11px] text-white/70 mt-0.5">Transparent Breakdown</p>
                </div>
              </div>

              <button
                onClick={() => navigate("/sell")}
                className="px-6 py-3 rounded-xl bg-white text-[#123B75] font-extrabold text-sm shadow-md hover:bg-[#F4F8FF] transition-all"
              >
                Evaluate My Phone in 60s &rarr;
              </button>
            </div>
          </div>

          {/* Right Side: Smart Comparison & Buying Experience */}
          <div className="p-8 rounded-3xl bg-white border border-[#DCEBFF] shadow-[0_8px_30px_rgba(52,120,246,0.06)] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#3478F6]">Buyer Intelligence</span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#123B75] mt-1 mb-4">
                Compare Side-by-Side with Precision
              </h3>
              <p className="text-sm text-[#123B75]/75 leading-relaxed mb-6">
                Make confident decisions. Compare camera MP, chipset benchmarks, battery capacities, and physical conditions across up to 4 models simultaneously.
              </p>

              {/* Feature Checklist */}
              <div className="space-y-3 mb-8">
                {[
                  "32-point inspection report included with every listing",
                  "Verified buyer protection & 6-month comprehensive warranty",
                  "15-day no-questions-asked replacement guarantee",
                  "Free doorstep delivery with live package tracking",
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#123B75]">
                    <div className="w-5 h-5 rounded-full bg-[#EDF4FF] border border-[#3478F6] text-[#3478F6] flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      ✓
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/phones")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#3478F6] text-white font-bold text-sm shadow-[0_4px_16px_rgba(52,120,246,0.3)] hover:bg-[#1D5EDB] transition-all text-center"
            >
              Browse Certified Phones &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          SECTION D: SELLER EXPERIENCE & SUPER SELLER PROGRAM
          Online selling and analytics visualization.
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#F4F8FF] via-[#EDF4FF] to-[#DCEBFF] border border-[#DCEBFF] relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1D5EDB] bg-white px-3 py-1 rounded-full border border-[#DCEBFF]">
              Seller Ecosystem
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-[#123B75] mt-3 mb-4">
              Scale Your Electronics Business with FALCON
            </h3>
            <p className="text-sm sm:text-base text-[#123B75]/80 leading-relaxed mb-6">
              Join thousands of verified electronics retailers. Unlock lowest platform commission (1–1.5%), Super Seller priority trade-in leads, and an integrated real-time analytics dashboard.
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white">
                <span className="text-lg sm:text-xl font-black text-[#123B75]">1 - 1.5%</span>
                <p className="text-[10px] text-[#123B75]/70">Lowest Commission</p>
              </div>
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white">
                <span className="text-lg sm:text-xl font-black text-[#3478F6]">6h Window</span>
                <p className="text-[10px] text-[#123B75]/70">Super Seller Priority</p>
              </div>
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white">
                <span className="text-lg sm:text-xl font-black text-[#1D5EDB]">24/7</span>
                <p className="text-[10px] text-[#123B75]/70">Dedicated Support</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/subscribe")}
                className="px-6 py-3.5 rounded-2xl bg-[#1D5EDB] text-white font-bold text-sm shadow-[0_6px_20px_rgba(29,94,219,0.35)] hover:bg-[#123B75] transition-all"
              >
                Become a Seller &rarr;
              </button>
              <button
                onClick={() => navigate("/seller-dashboard")}
                className="px-6 py-3.5 rounded-2xl bg-white text-[#123B75] font-bold text-sm border border-[#DCEBFF] hover:border-[#3478F6] transition-all"
              >
                Open Seller Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
