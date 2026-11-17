//ProductDetails.jsx — Enhanced with zoom lens, video gallery support, and refined UI

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useCart } from "../../../context/cart.context";
import { getProductById } from "../../../services/product.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productKeys } from "../../../hooks/useProducts.query";
import {
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  addToCart,
  checkCart,
} from "../../../services/shop.api";
import BuyNowPage from "../../Transactions/BuyNowPage";
import SimilarProducts from "../components/SimilarProducts";
import ReviewSection from "../components/ReviewSection";
import { createPortal } from "react-dom";
import CompareDevices from "./CompareDevices";
import LazyImage from "../../../components/LazyImage";
import { getDeviceImage, getDeviceFallback } from "../../../utils/deviceImages";


const useWishlistStatus = (productId, isAuthenticated) =>
  useQuery({
    queryKey: ["wishlist", "check", productId],
    queryFn:  () => checkWishlist(productId),
    enabled:  !!productId && isAuthenticated,
    select:   (d) => d.isWishlisted ?? false,
    staleTime: 1000 * 60 * 5,
  });

const useCartStatus = (productId, isAuthenticated) =>
  useQuery({
    queryKey: ["cart", "check", productId],
    queryFn:  () => checkCart(productId),
    enabled:  !!productId && isAuthenticated,
    select:   (d) => d.isInCart ?? false,
    staleTime: 1000 * 60 * 5,
  });

// ─── Icon helper ──────────────────────────────────────────────────────────────
const Ic = ({ d, className = "w-5 h-5", fill = "none" }) => (
  <svg
    className={className}
    fill={fill}
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const ICONS = {
  heart:
    "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  cart: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
  bolt: "M13 10V3L4 14h7v7l9-11h-7z",
  share:
    "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z",
  shield:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  map: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
  tag: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z",
  check: "M5 13l4 4L19 7",
  arrow: "M10 19l-7-7m0 0l7-7m-7 7h18",
  star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  chip: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
  display:
    "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  camera:
    "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
  battery:
    "M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
  storage:
    "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2",
  play: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  zoom: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7",
  close: "M6 18L18 6M6 6l12 12",
};

const conditionColors = {
  "Like New": "bg-emerald-50 text-emerald-700 border-emerald-200",
  Superb: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Good: "bg-blue-50 text-blue-700 border-blue-200",
  Fair: "bg-amber-50 text-amber-700 border-amber-200",
};

const deviceTypeColors = {
  new: "bg-violet-50 text-violet-700 border-violet-200",
  refurbished: "bg-teal-50 text-teal-700 border-teal-200",
  old: "bg-orange-50 text-orange-700 border-orange-200",
};

// ─── Condition Guide Modal ─────────────────────────────────────────────────────
function ConditionGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const GRADES = [
    {
      grade: "Like New",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cosmeticScore: "99% - 100% Flawless",
      batteryScore: "95%+ Original Battery Health",
      desc: "Device is in pristine cosmetic condition. Zero scratches, marks, or scuffs on display or frame. Looks and functions identically to a brand new factory device.",
    },
    {
      grade: "Superb",
      color: "bg-teal-50 text-teal-700 border-teal-200",
      cosmeticScore: "95% - 98% Pristine",
      batteryScore: "88%+ Battery Health",
      desc: "Screen is flawless with no scratches. Body may have 1-2 faint micro-marks invisible from arm's length. 100% hardware certified with premium performance.",
    },
    {
      grade: "Good",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      cosmeticScore: "90% - 94% Very Good",
      batteryScore: "82%+ Battery Health",
      desc: "Minor signs of gentle everyday use on the back or frame. Screen has no cracks or deep gouges. Fully certified and rigorously tested by FELCON engineers.",
    },
    {
      grade: "Fair",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      cosmeticScore: "80% - 89% Functional Value",
      batteryScore: "80%+ Battery Health",
      desc: "Visible scratches or scuffs on the body. Screen is completely intact and crack-free. Offers 100% functionality at the highest possible discount savings.",
    },
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-[#0077b6] uppercase tracking-wider">Quality Standard</span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">FELCON Refurbished Grading Guide</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition">
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
          Every device sold on FELCON undergoes a 32-point diagnostic hardware check, complete sanitization, and certified battery health verification.
        </p>

        <div className="space-y-3.5 mt-5">
          {GRADES.map((g) => (
            <div key={g.grade} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-100 hover:shadow-sm transition">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${g.color}`}>{g.grade} Grade</span>
                <div className="flex gap-2 text-[11px] font-semibold text-slate-500">
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{g.cosmeticScore}</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">{g.batteryScore}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-xl bg-[#0077b6] text-white text-sm font-bold shadow-md hover:bg-[#005f8f] transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

// ─── 32-Point Quality Inspection Certificate Modal ────────────────────────────
function InspectionModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;
  const certId = product.inspectionRecord?.certificateId || `FEL-QC-${(product._id || "928371").slice(-6).toUpperCase()}`;

  const CHECKLIST = [
    {
      category: "1. Display & Multi-Touch",
      items: ["Screen touch sensitivity & latency", "Multi-touch gesture responsiveness", "Color reproduction & TrueTone", "Zero dead pixels or backlight bleed"],
    },
    {
      category: "2. Battery Health & Charging",
      items: ["OEM battery authenticity verified", "Rapid charging & power delivery", "Standby drain & voltage regulation", "Thermal dissipation under full load"],
    },
    {
      category: "3. Cameras & Optics",
      items: ["Primary rear camera autofocus & sensor", "Ultra-wide & optical telephoto lens", "Selfie front camera clarity", "Optical Image Stabilization (OIS) & flash"],
    },
    {
      category: "4. Audio, Speakers & Mics",
      items: ["Stereo dual-speaker balance & EQ", "Earpiece receiver volume & clarity", "Multi-microphone noise suppression", "Audio recording & frequency response"],
    },
    {
      category: "5. Wireless & Biometrics",
      items: ["5G / 4G LTE cellular band connectivity", "Wi-Fi 6/6E/7 high-speed throughput", "Bluetooth 5.3 pairing & range", "Biometric Face ID / Fingerprint sensor", "GPS, compass, gyro & proximity sensors"],
    },
    {
      category: "6. Chassis & Sanitization",
      items: ["Aluminum / Titanium chassis structural integrity", "Charging port cleanliness & pin continuity", "Tactile volume & power button click", "Hospital-grade UV-C sanitization applied"],
    },
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
        {/* Certificate Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0077b6] flex items-center justify-center border border-blue-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#0077b6] uppercase">Official Certificate</span>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">32-Point Quality Inspection Report</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition">
            ✕
          </button>
        </div>

        {/* Device & Cert info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 my-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Device</span>
            <span className="font-bold text-slate-800 line-clamp-1">{product.title}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Certificate No.</span>
            <span className="font-mono font-bold text-[#0077b6]">{certId}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Condition Grade</span>
            <span className="font-bold text-emerald-600">{product.condition || "Like New"} Grade</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
            <span className="font-bold text-emerald-600">✓ 32/32 Passed</span>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3.5">
          {CHECKLIST.map((sec) => (
            <div key={sec.category} className="border border-slate-100 rounded-2xl p-3.5 bg-white">
              <h4 className="text-xs font-bold text-slate-800 mb-2">{sec.category}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sec.items.map((it) => (
                  <div key={it} className="flex items-center gap-2 text-[11px] text-slate-600">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[9px] flex-shrink-0">✓</span>
                    <span>{it}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
          <p className="text-xs font-bold text-emerald-800">Verified & Sealed by FELCON Diagnostics Lab</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Backed by 6-Month Replacement Warranty & 7-Day Money Back Guarantee</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-xl bg-[#0077b6] text-white text-sm font-bold shadow-md hover:bg-[#005f8f] transition"
        >
          Close Certificate
        </button>
      </div>
    </div>
  );
}

// ─── Trade-In / Exchange Old Device Modal ───────────────────────────────────────
function ExchangeModal({ isOpen, onClose, product, onApplyExchange }) {
  if (!isOpen || !product) return null;

  const EXCHANGE_MODELS = [
    { brand: "Apple", name: "iPhone 14 Pro", baseValue: 34000 },
    { brand: "Apple", name: "iPhone 14", baseValue: 26000 },
    { brand: "Apple", name: "iPhone 13", baseValue: 21000 },
    { brand: "Apple", name: "iPhone 12", baseValue: 15000 },
    { brand: "Samsung", name: "Galaxy S23 Ultra", baseValue: 36000 },
    { brand: "Samsung", name: "Galaxy S23", baseValue: 24000 },
    { brand: "Samsung", name: "Galaxy S22", baseValue: 16000 },
    { brand: "OnePlus", name: "OnePlus 11", baseValue: 19000 },
    { brand: "OnePlus", name: "OnePlus 10 Pro", baseValue: 14000 },
    { brand: "Google", name: "Pixel 8", baseValue: 22000 },
    { brand: "Google", name: "Pixel 7 Pro", baseValue: 17000 },
    { brand: "Xiaomi", name: "Xiaomi 13 Pro", baseValue: 18000 },
  ];

  const [selectedBrand, setSelectedBrand] = useState("Apple");
  const [selectedModelName, setSelectedModelName] = useState("iPhone 13");
  const [condition, setCondition] = useState("Flawless"); // Flawless, Good, Average

  const availableModels = EXCHANGE_MODELS.filter((m) => m.brand === selectedBrand);
  const currentModel = EXCHANGE_MODELS.find((m) => m.brand === selectedBrand && m.name === selectedModelName) || availableModels[0];

  const conditionMultiplier = condition === "Flawless" ? 1.0 : condition === "Good" ? 0.8 : 0.6;
  const valuation = Math.round((currentModel?.baseValue || 15000) * conditionMultiplier);
  const netPayable = Math.max(0, product.price - valuation);

  const handleApply = () => {
    onApplyExchange({
      isExchange: true,
      device: `${selectedBrand} ${selectedModelName} (${condition})`,
      value: valuation,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-[#0077b6] uppercase tracking-wider">FELCON Trade-In</span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">Exchange Your Old Device</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition">
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-3">
          Get an instant exchange discount deducted directly from this {product.title}. Our executive will verify and collect your old device at delivery.
        </p>

        {/* Brand selector */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-2">1. Select Brand</label>
          <div className="flex gap-2 flex-wrap">
            {["Apple", "Samsung", "OnePlus", "Google", "Xiaomi"].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => {
                  setSelectedBrand(b);
                  const first = EXCHANGE_MODELS.find((m) => m.brand === b);
                  if (first) setSelectedModelName(first.name);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  selectedBrand === b ? "bg-[#0077b6] text-white border-[#0077b6]" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Model selector */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-2">2. Select Model</label>
          <select
            value={selectedModelName}
            onChange={(e) => setSelectedModelName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0077b6]"
          >
            {availableModels.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Condition selector */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-2">3. Physical Condition</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "Flawless", label: "Flawless", hint: "No scratches" },
              { id: "Good", label: "Good", hint: "Minor marks" },
              { id: "Average", label: "Average", hint: "Visible wear" },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCondition(c.id)}
                className={`p-2.5 rounded-xl border text-center transition ${
                  condition === c.id ? "bg-blue-50 border-[#0077b6] text-[#0077b6]" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="block text-xs font-bold">{c.label}</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">{c.hint}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price calculation block */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-100 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Refurbished {product.title}</span>
            <span className="font-semibold">₹{product.price?.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>Exchange Discount ({selectedModelName})</span>
            <span>−₹{valuation.toLocaleString("en-IN")}</span>
          </div>
          <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
            <span className="text-sm font-extrabold text-slate-900">Final Payable Amount</span>
            <span className="text-lg font-extrabold text-[#0077b6]">₹{netPayable.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="flex gap-2.5 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 rounded-xl bg-[#0077b6] text-white text-xs font-bold shadow-md hover:bg-[#005f8f] transition"
          >
            Apply Trade-In
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold
      ${type === "error" ? "bg-red-600 text-white" : "bg-slate-900 text-white"}`}
      style={{ animation: "slideUpToast 0.3s ease both" }}
    >
      <Ic
        d={type === "error" ? ICONS.close : ICONS.check}
        className="w-4 h-4"
      />
      {msg}
    </div>
  );
}

// ─── Spec chip ────────────────────────────────────────────────────────────────
function SpecChip({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(0,119,182,0.08)", color: "#0077b6" }}
      >
        <Ic d={icon} className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-snug">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Amazon-style Image Gallery with Zoom Lens + Video ───────────────────────
const ZOOM_FACTOR = 2.5;
const LENS_SIZE = 140; // px



function ImageGallery({ images, video, category, product }) {
  const resolvedImages = (images && images.length > 0 && !images[0].includes("logo.png") && !images[0].includes("placeholder"))
    ? images
    : [getDeviceImage(product || { category })];

  // Build media list: images first, then video last
  const mediaList = [
    ...resolvedImages.map((url) => ({ type: "image", url })),
    ...(video ? [{ type: "video", url: video }] : []),
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [zoomBg, setZoomBg] = useState({ x: 0, y: 0 });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const active = mediaList[activeIdx] || { type: "image", url: "" };

  const handleMouseMove = useCallback(
    (e) => {
      if (active.type !== "image") return;

      const img = imgRef.current;
      const container = containerRef.current;
      if (!img || !container) return;

      const imgRect = img.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Ignore if outside actual image (important)
      if (
        e.clientX < imgRect.left ||
        e.clientX > imgRect.right ||
        e.clientY < imgRect.top ||
        e.clientY > imgRect.bottom
      ) {
        setZooming(false);
        return;
      }

      setZooming(true);

      // Cursor relative to IMAGE
      const x = e.clientX - imgRect.left;
      const y = e.clientY - imgRect.top;

      // Clamp inside image
      const clampedX = Math.max(0, Math.min(x, imgRect.width));
      const clampedY = Math.max(0, Math.min(y, imgRect.height));

      // Save target (used for smoothing)
      targetRef.current = {
        x: clampedX,
        y: clampedY,
        imgW: imgRect.width,
        imgH: imgRect.height,
        naturalW: img.naturalWidth,
        naturalH: img.naturalHeight,
      };

      // Lens position (relative to container)
      const lx = e.clientX - containerRect.left;
      const ly = e.clientY - containerRect.top;

      setLensPos({
        x: lx - LENS_SIZE / 2,
        y: ly - LENS_SIZE / 2,
      });
    },
    [active.type],
  );

  useEffect(() => {
    const animate = () => {
      const t = targetRef.current;
      const c = currentRef.current;

      // Smooth interpolation
      c.x += (t.x - c.x) * 0.18;
      c.y += (t.y - c.y) * 0.18;

      // Convert to NATURAL image scale
      const scaleX = t.naturalW / t.imgW;
      const scaleY = t.naturalH / t.imgH;

      const bgX = c.x * scaleX * ZOOM_FACTOR;
      const bgY = c.y * scaleY * ZOOM_FACTOR;

      setZoomBg({
        x: bgX,
        y: bgY,
        w: t.naturalW * ZOOM_FACTOR,
        h: t.naturalH * ZOOM_FACTOR,
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseEnter = () => {
    if (active.type === "image" && active.url) setZooming(true);
  };
  const handleMouseLeave = () => setZooming(false);

  if (!mediaList.length) {
    return (
      <div className="bg-slate-50 rounded-3xl border border-slate-100 h-[380px] flex items-center justify-center p-6">
        <img
          src={getDeviceFallback(category)}
          alt="Product placeholder"
          className="max-h-72 w-auto object-contain drop-shadow"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ── Main view area ── */}
      <div className="relative">
        <div
          ref={containerRef}
          className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 rounded-3xl border border-slate-100 overflow-hidden flex items-center justify-center"
          style={{
            height: 380,
            cursor: active.type === "image" ? "crosshair" : "default",
            boxShadow: "0 4px 24px rgba(0,119,182,0.06)",
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {active.type === "image" ? (
            active.url ? (
              <>
                <img
                  ref={imgRef}
                  src={active.url}
                  alt="product"
                  className="max-h-72 max-w-full object-contain transition-all duration-200 select-none"
                  draggable={false}
                />
                {/* Zoom lens overlay */}
                {zooming && (
                  <div
                    className="absolute pointer-events-none rounded-lg border-2"
                    style={{
                      width: LENS_SIZE,
                      height: LENS_SIZE,
                      left: lensPos.x,
                      top: lensPos.y,
                      border: "2px solid rgba(0,119,182,0.5)",
                      background: "rgba(0,119,182,0.06)",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.8) inset",
                    }}
                  />
                )}
                {/* Expand button */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-500 opacity-0 hover:opacity-100 transition-opacity"
                  style={{ opacity: zooming ? 1 : undefined }}
                  title="View full size"
                >
                  <Ic d={ICONS.zoom} className="w-4 h-4" />
                </button>
              </>
            ) : (
              <span className="text-6xl opacity-20">📱</span>
            )
          ) : (
            /* ── Video player ── */
            <video
              src={active.url}
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              className="max-h-72 max-w-full rounded-2xl"
              style={{ outline: "none", pointerEvents: "none" }}
            />
          )}
        </div>

        {/* ── Zoom result panel — rendered in a portal to escape all stacking contexts ── */}
        {zooming &&
          active.url &&
          containerRef.current &&
          createPortal(
            <div
              className="pointer-events-none fixed rounded-2xl border border-slate-200 overflow-hidden"
              style={{
                top: containerRef.current.getBoundingClientRect().top,
                left: containerRef.current.getBoundingClientRect().right + 32,
                width:
                  window.innerWidth -
                  containerRef.current.getBoundingClientRect().right -
                  78,
                height: 380,
                backgroundImage: `url(${active.url})`,
                backgroundRepeat: "no-repeat",

                // CRITICAL: pixel-based sizing
                backgroundSize: `${zoomBg.w}px ${zoomBg.h}px`,

                // CRITICAL: invert position for correct alignment
                backgroundPosition: `${-zoomBg.x + LENS_SIZE / 2}px ${-zoomBg.y + LENS_SIZE / 2}px`,
                boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
                zIndex: 99999,
                backgroundColor: "#f8fafc",
              }}
            />,
            document.body,
          )}
      </div>

      {/* ── Thumbnails ── */}
      {mediaList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {mediaList.map((media, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIdx(i);
                setZooming(false);
              }}
              className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 bg-slate-50 flex items-center justify-center overflow-hidden transition-all ${
                activeIdx === i
                  ? "border-[#0077b6] shadow-[0_0_0_3px_rgba(0,119,182,0.12)]"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {media.type === "image" ? (
                media.url ? (
                  <LazyImage
                    src={media.url}
                    alt=""
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <span className="text-lg opacity-20">📱</span>
                )
              ) : (
                /* Video thumbnail */
                <div className="relative w-full h-full flex items-center justify-center bg-slate-800 rounded-lg">
                  <Ic d={ICONS.play} className="w-6 h-6 text-white" />
                  <span className="absolute bottom-0.5 right-0.5 text-[9px] bg-black/60 text-white px-1 rounded">
                    ▶
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxOpen && active.type === "image" && (
        <div
          className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-6"
          onClick={() => setLightboxOpen(false)}
          style={{ animation: "fadeInLightbox 0.2s ease" }}
        >
          <button
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <Ic d={ICONS.close} className="w-6 h-6" />
          </button>
          <LazyImage
            src={active.url}
            alt="full view"
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.5)" }}
          />
          {/* Nav arrows in lightbox */}
          {mediaList.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors disabled:opacity-30"
                disabled={activeIdx === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((i) => Math.max(0, i - 1));
                }}
              >
                ‹
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors disabled:opacity-30"
                disabled={activeIdx === mediaList.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((i) => Math.min(mediaList.length - 1, i + 1));
                }}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addItem, isInCart: checkIsInCart } = useCart();
  const qc = useQueryClient();
  const [wLoading, setWLoading] = useState(false);
  const [cLoading, setCLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("specs");
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  // New Refurbished & Trade-in state
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showConditionGuideModal, setShowConditionGuideModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeResult, setPincodeResult] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const {
    data: product,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: productKeys.detail(id),
    queryFn:  () => getProductById(id),
    enabled:  !!id,
    select:   (d) => d.data ?? d.product ?? d,
    staleTime: 1000 * 60 * 3,
  });

  // Track recently viewed products in localStorage
  useEffect(() => {
    if (!product?._id) return;
    try {
      const raw = localStorage.getItem("felcon_recently_viewed");
      const list = raw ? JSON.parse(raw) : [];
      setRecentlyViewed(list.filter((p) => p._id !== product._id).slice(0, 6));

      const updated = [
        {
          _id: product._id,
          title: product.title,
          price: product.price,
          originalPrice: product.originalPrice,
          images: product.images,
          brand: product.brand,
          condition: product.condition,
          category: product.category,
        },
        ...list.filter((p) => p._id !== product._id),
      ].slice(0, 10);
      localStorage.setItem("felcon_recently_viewed", JSON.stringify(updated));
    } catch {}
  }, [product?._id]);

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincodeInput.trim() || pincodeInput.trim().length < 6) {
      setPincodeResult({ valid: false, message: "Please enter a valid 6-digit delivery pincode" });
      return;
    }
    const d = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
    setPincodeResult({
      valid: true,
      message: `Delivery by ${dateStr} · Free Express Courier by BlueDart Express`,
    });
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      const returnUrl = `/product/${id}`;
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`, {
        state: { returnUrl },
      });
      return;
    }
    setShowBuyNow(true);
  };

  const { data: wishlisted = false } = useWishlistStatus(id, isAuthenticated);
  const wishlistMutation = useMutation({
    mutationFn: () => wishlisted ? removeFromWishlist(id) : addToWishlist(id),
    onSuccess: () => {
      qc.setQueryData(["wishlist", "check", id], { isWishlisted: !wishlisted });
    },
  });

  const { data: inCartStatus = false } = useCartStatus(id, isAuthenticated);
  const inCart = checkIsInCart(id) || inCartStatus;

  const handleWishlist = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/product/${id}`)}`, {
        state: { returnUrl: `/product/${id}` },
      });
      return;
    }
    wishlistMutation.mutate();
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      const returnUrl = `/product/${id}`;
      const pendingCart = {
        productId: id,
        productTitle: product?.title || "Device",
        quantity: 1,
        returnUrl,
      };
      sessionStorage.setItem("felcon_pending_cart", JSON.stringify(pendingCart));
      sessionStorage.setItem("falcon_pending_cart", JSON.stringify(pendingCart));
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`, {
        state: {
          returnUrl,
          pendingCart,
        },
      });
      return;
    }

    if (inCart) {
      navigate("/cart");
      return;
    }

    setCLoading(true);
    try {
      await addItem(id, 1);
      qc.setQueryData(["cart", "check", id], { isInCart: true });
      showToast(`Added "${product?.title || "Product"}" to your cart!`);
    } catch (err) {
      showToast(err?.message || "Failed to add to cart", "error");
    } finally {
      setCLoading(false);
    }
  };



  if (showBuyNow && product)
    return <BuyNowPage product={product} exchange={selectedExchange} onBack={() => setShowBuyNow(false)} />;

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 rounded-full animate-spin"
        style={{ border: "3px solid rgba(0,119,182,0.2)", borderTopColor: "#0077b6" }} />
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
      <span className="text-5xl">📦</span>
      <p className="text-slate-600 font-semibold">Product not found</p>
      <button onClick={() => navigate(-1)} className="text-sm font-semibold text-[#0077b6] hover:underline">← Go back</button>
    </div>
  );

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  const specs = product.specs;
  const isOwner =
    user?._id === product.listedBy?._id || user?._id === product.listedBy;
  const canBuy = product.status === "available" && !isOwner;
  const hasVideo = !!product.video;
  const totalMedia = (product.images?.length || 0) + (hasVideo ? 1 : 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .pd-root { font-family: 'DM Sans', sans-serif; }
        .pd-display { font-family: 'Sora', sans-serif; }

        @keyframes slideUp        { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn         { from{opacity:0} to{opacity:1} }
        @keyframes slideUpToast   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInLightbox { from{opacity:0} to{opacity:1} }

        .slide-up { animation: slideUp  0.45s ease both; }
        .fade-in  { animation: fadeIn   0.3s  ease both; }

        /* Custom scrollbar for thumbnails */
        .thumb-scroll::-webkit-scrollbar { height: 4px; }
        .thumb-scroll::-webkit-scrollbar-track { background: transparent; }
        .thumb-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
      `}</style>

      <div className="pd-root bg-white min-h-screen">
        {/* ── Sticky top bar ── */}
        <div className="sticky top-0 z-[10000] bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#0077b6] transition-colors"
          >
            <Ic d={ICONS.arrow} className="w-4 h-4" /> Back
          </button>

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>/</span>
            <span className="capitalize">{product.category}</span>
            {product.brand && (
              <>
                <span>/</span>
                <span>{product.brand}</span>
              </>
            )}
          </div>

          <div className="flex-1" />

          {/* Media count badge */}
          {totalMedia > 1 && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {totalMedia} media
            </span>
          )}

          <button
            onClick={handleWishlist}
            disabled={wLoading}
            className={`p-2 rounded-xl border transition-all ${wishlisted ? "border-red-200 bg-red-50" : "border-slate-200 hover:border-red-200 hover:bg-red-50"}`}
          >
            <svg
              className={`w-5 h-5 ${wishlisted ? "text-red-500 fill-red-500" : "text-slate-400"}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={ICONS.heart}
              />
            </svg>
          </button>
          <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:border-[#0077b6] hover:text-[#0077b6] transition-all">
            <Ic d={ICONS.share} className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* ── LEFT: Gallery ── */}
            <div className="lg:w-[440px] flex-shrink-0 slide-up">
              <div className="sticky top-20" style={{ isolation: "isolate" }}>
                <ImageGallery images={product.images} video={product.video} category={product.category} product={product} />

                {/* Video indicator */}
                {hasVideo && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Ic
                      d={ICONS.play}
                      className="w-3.5 h-3.5"
                      style={{ color: "#0077b6" }}
                    />
                    Product video included
                  </div>
                )}

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-4 items-center">
                  {product.deviceType && (
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border capitalize ${deviceTypeColors[product.deviceType] || "bg-slate-100 text-slate-600 border-slate-200"}`}
                    >
                      {product.deviceType}
                    </span>
                  )}
                  {product.condition && (
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border ${conditionColors[product.condition] || "bg-slate-100 text-slate-600 border-slate-200"}`}
                      >
                        {product.condition} Grade
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowConditionGuideModal(true)}
                        className="text-[11px] font-bold text-[#0077b6] hover:underline"
                        title="Learn more about our condition grading"
                      >
                        Guide ⓘ
                      </button>
                    </div>
                  )}
                  {product.status === "available" && (
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ In Stock
                    </span>
                  )}
                </div>

                {/* Verified Battery Health Gauge */}
                {product.batteryHealth && (
                  <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">🔋</span>
                      <div>
                        <p className="text-xs font-bold text-emerald-900">Verified Battery Health: {product.batteryHealth}</p>
                        <p className="text-[10px] text-emerald-700">OEM genuine battery diagnostic passed · High cycle retention</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">Verified</span>
                  </div>
                )}

                {/* 32-Point Quality Certified Banner */}
                <button
                  type="button"
                  onClick={() => setShowInspectionModal(true)}
                  className="w-full mt-3 flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 border border-blue-200 text-left hover:bg-blue-100/60 transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#0077b6] text-white flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0077b6] group-hover:underline">32-Point Quality Certified</p>
                      <p className="text-[10px] text-slate-500">Hardware, camera, display & UV-C sanitized</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#0077b6]">View Cert →</span>
                </button>

                {/* FELCON assured */}
                <div
                  className="mt-3 flex items-center gap-3 rounded-2xl px-4 py-3"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(0,119,182,0.05), rgba(219,234,254,0.5))",
                    border: "1px solid rgba(0,119,182,0.1)",
                  }}
                >
                  <Ic
                    d={ICONS.shield}
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "#0077b6" }}
                  />
                  <div>
                    <p
                      className="text-xs font-bold"
                      style={{ color: "#0077b6" }}
                    >
                      FELCON Assured
                    </p>
                    <p className="text-xs text-slate-500">
                      Quality tested · 6-month warranty · 7-day returns
                    </p>
                  </div>
                </div>

                {/* What's in the Box */}
                <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">What's in the Box</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>Certified Device</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>Fast Charger & Cable</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>SIM Ejector Pin</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>Warranty Card</span>
                    </div>
                  </div>
                </div>

                {/* Zoom hint */}
                <p className="mt-2 text-center text-[11px] text-slate-400 font-medium">
                  🔍 Hover over image to zoom
                </p>
              </div>
            </div>

            {/* ── RIGHT: Details ── */}
            <div
              className="flex-1 space-y-5 slide-up"
              style={{ animationDelay: "0.08s" }}
            >
              {/* Brand + Title */}
              <div>
                {product.brand && (
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: "#0077b6" }}
                  >
                    {product.brand}
                  </p>
                )}
                <h1 className="pd-display text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                  {product.title}
                </h1>
                {(product.storage || product.color) && (
                  <p className="text-sm text-slate-500 mt-1.5 font-medium">
                    {[product.color, product.storage]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>

              {/* Rating row */}
              {product.rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill={
                          s <= Math.round(product.rating) ? "#f59e0b" : "none"
                        }
                        stroke="#f59e0b"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={ICONS.star}
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              )}

              {/* Price block */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 p-5">
                <div className="flex items-end gap-3 flex-wrap">
                  <span className="pd-display text-4xl font-extrabold text-slate-900">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-slate-400 line-through font-medium">
                      ₹{product.originalPrice?.toLocaleString("en-IN")}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-xs font-black bg-red-500 text-white px-3 py-1.5 rounded-xl">
                      {discount}% OFF
                    </span>
                  )}
                </div>
                {product.payment && (
                  <p className="text-xs text-slate-500 mt-2.5 font-medium">
                    Accepted:{" "}
                    <span className="font-semibold text-slate-700">
                      {product.payment}
                    </span>
                  </p>
                )}
                {discount > 0 && product.originalPrice && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    You save ₹
                    {(product.originalPrice - product.price).toLocaleString(
                      "en-IN",
                    )}
                  </p>
                )}
              </div>

              {/* ── Trade-In / Exchange Widget ── */}
              {selectedExchange ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <p className="text-xs font-bold text-emerald-900">
                        Trade-In Applied: {selectedExchange.device}
                      </p>
                      <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                        Exchange Deduction: −₹{selectedExchange.value?.toLocaleString("en-IN")} · Net Payable: ₹{Math.max(0, product.price - selectedExchange.value).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedExchange(null)}
                    className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0077b6] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      🔄
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">Exchange Your Old Device & Save Up To ₹25,000</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Instant online valuation · Doorstep exchange at delivery</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowExchangeModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#0077b6] text-white text-xs font-bold hover:bg-[#005f8f] transition flex-shrink-0 shadow-sm"
                  >
                    Check Value
                  </button>
                </div>
              )}

              {/* ── Delivery Pincode Estimator ── */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700">
                  <svg className="w-4 h-4 text-[#0077b6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h2m-6 0a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <span>Delivery & Free Shipping Check</span>
                </div>
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit Pincode"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#0077b6] flex-1 font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                  >
                    Check
                  </button>
                </form>
                {pincodeResult && (
                  <p className={`text-xs mt-2 font-medium ${pincodeResult.valid ? "text-emerald-600" : "text-red-500"}`}>
                    {pincodeResult.message}
                  </p>
                )}
              </div>

              {/* Location + Listed by */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                {(product.address?.city || product.address?.full) && (
                  <div className="flex items-center gap-1.5">
                    <Ic
                      d={ICONS.map}
                      className="w-4 h-4"
                      style={{ color: "#0077b6" }}
                    />
                    <span>
                      {product.address.full ||
                        `${product.address.city}, ${product.address.state}`}
                    </span>
                  </div>
                )}
                {product.createdAt && (
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <span>
                      Listed{" "}
                      {new Date(product.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    About this product
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* ── CTA Buttons ── */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={cLoading || !canBuy}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    inCart
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : ""
                  }`}
                  style={
                    !inCart
                      ? { borderColor: "rgba(0,119,182,0.3)", color: "#0077b6" }
                      : {}
                  }
                >
                  {cLoading ? (
                    <span
                      className="w-4 h-4 rounded-full animate-spin"
                      style={{
                        border: "2px solid rgba(0,119,182,0.3)",
                        borderTopColor: "#0077b6",
                      }}
                    />
                  ) : (
                    <Ic d={ICONS.cart} className="w-4 h-4" />
                  )}
                  {inCart ? "Go to Cart →" : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!canBuy}
                  className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  style={{
                    backgroundColor: "#0077b6",
                    boxShadow: "0 4px 20px rgba(0,119,182,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#005f8f";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 28px rgba(0,119,182,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#0077b6";
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(0,119,182,0.35)";
                  }}
                >
                  <Ic d={ICONS.bolt} className="w-4 h-4" />
                  Buy Now
                </button>
              </div>

              {isOwner && (
                <p className="text-xs text-center text-slate-400 font-medium py-1">
                  This is your own listing
                </p>
              )}
              {product.status !== "available" && (
                <p className="text-xs text-center text-red-500 font-semibold capitalize py-1">
                  This product is {product.status}
                </p>
              )}

              {/* ── Tabs ── */}
              <div className="border-b border-slate-100">
                <div className="flex gap-0">
                  {[
                    { key: "specs", label: "Specifications" },
                    { key: "cosmetic", label: "Condition" },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className="px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap"
                      style={
                        activeTab === t.key
                          ? { borderColor: "#0077b6", color: "#0077b6" }
                          : { borderColor: "transparent", color: "#64748b" }
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SPECS TAB */}
              {activeTab === "specs" && (
                <div className="fade-in space-y-4">
                  {specs ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <SpecChip
                        icon={ICONS.chip}
                        label="Chipset"
                        value={specs.performance?.chipsetFull}
                      />
                      <SpecChip
                        icon={ICONS.chip}
                        label="RAM"
                        value={specs.performance?.ram}
                      />
                      <SpecChip
                        icon={ICONS.display}
                        label="Display"
                        value={
                          specs.display?.sizeInches
                            ? `${specs.display.sizeInches} ${specs.display.type || ""}`.trim()
                            : null
                        }
                      />
                      <SpecChip
                        icon={ICONS.display}
                        label="Refresh Rate"
                        value={specs.display?.refreshRate}
                      />
                      <SpecChip
                        icon={ICONS.camera}
                        label="Rear Camera"
                        value={specs.rearCamera?.primary}
                      />
                      <SpecChip
                        icon={ICONS.camera}
                        label="Front Camera"
                        value={specs.frontCamera}
                      />
                      <SpecChip
                        icon={ICONS.battery}
                        label="Battery"
                        value={specs.battery?.capacity}
                      />
                      <SpecChip
                        icon={ICONS.battery}
                        label="Charging"
                        value={specs.battery?.wiredCharging}
                      />
                      <SpecChip
                        icon={ICONS.storage}
                        label="Storage"
                        value={product.storage}
                      />
                      <SpecChip
                        icon={ICONS.storage}
                        label="Storage Type"
                        value={specs.storageType}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.storage && (
                        <SpecChip
                          icon={ICONS.storage}
                          label="Storage"
                          value={product.storage}
                        />
                      )}
                      {product.color && (
                        <SpecChip
                          icon={ICONS.tag}
                          label="Color"
                          value={product.color}
                        />
                      )}
                      {product.category && (
                        <SpecChip
                          icon={ICONS.tag}
                          label="Category"
                          value={product.category}
                        />
                      )}
                    </div>
                  )}

                  {/* Full spec table */}
                  {specs && (
                    <div className="rounded-2xl border border-slate-100 overflow-hidden mt-2">
                      {[
                        ["Brand", product.brand],
                        ["Category", product.category],
                        ["Storage", product.storage],
                        ["Color", product.color],
                        ["Chipset", specs.performance?.chipsetFull],
                        ["RAM", specs.performance?.ram],
                        ["Display Size", specs.display?.sizeInches],
                        ["Display Type", specs.display?.type],
                        [
                          "Resolution",
                          specs.display?.resolution
                            ? `${specs.display.resolution} (${specs.display.resolutionType || ""})`
                            : null,
                        ],
                        ["Refresh Rate", specs.display?.refreshRate],
                        ["Rear Camera", specs.rearCamera?.primary],
                        ["2nd Camera", specs.rearCamera?.secondary],
                        ["Front Camera", specs.frontCamera],
                        ["Battery", specs.battery?.capacity],
                        ["Charging", specs.battery?.wiredCharging],
                        ["Storage Type", specs.storageType],
                      ]
                        .filter(([, v]) => v)
                        .map(([label, val], i) => (
                          <div
                            key={label}
                            className={`flex text-sm ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
                          >
                            <span className="w-36 px-4 py-3 text-slate-400 font-semibold border-r border-slate-100 flex-shrink-0 text-xs uppercase tracking-wide">
                              {label}
                            </span>
                            <span className="px-4 py-3 text-slate-700 font-medium">
                              {val}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* CONDITION TAB */}
              {activeTab === "cosmetic" && (
                <div className="fade-in space-y-4">
                  <div
                    className={`flex items-start gap-3 rounded-2xl p-4 border ${conditionColors[product.condition] || "bg-slate-50 border-slate-200"}`}
                  >
                    <Ic
                      d={ICONS.shield}
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-bold">
                        {product.condition} Condition
                      </p>
                      <p className="text-xs mt-1 opacity-80">
                        {product.condition === "Superb" &&
                          "Like new — no visible scratches or marks under any lighting."}
                        {product.condition === "Good" &&
                          "Minor cosmetic wear, fully functional with no defects."}
                        {product.condition === "Fair" &&
                          "Visible signs of use, fully functional. Great value pick."}
                      </p>
                    </div>
                  </div>
                  {product.images?.length > 1 && (
                    <div className="grid grid-cols-2 gap-3">
                      {product.images.slice(1).map((img, i) => (
                        <div
                          key={i}
                          className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden"
                        >
                          <LazyImage
                            src={img}
                            alt={`view-${i}`}
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Show video in condition tab too */}
                  {product.video && (
                    <div className="rounded-2xl border border-slate-100 overflow-hidden">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4 pt-3 pb-2">
                        Product Video
                      </p>
                      <video
                        src={product.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        disablePictureInPicture
                        controlsList="nodownload nofullscreen noremoteplayback"
                        className="w-full rounded-b-2xl"
                        style={{ outline: "none", pointerEvents: "none" }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Similar Products ── */}
        <SimilarProducts
          brand={product.brand}
          price={product.price}
          currentId={product._id}
          navigate={navigate}
        />
        {/* ── Compare Devices ── */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <button
            onClick={() => setShowCompare((prev) => !prev)}
            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-200"
            style={{
              background: showCompare ? "#0077b6" : "#e8f4fd",
              color: showCompare ? "#fff" : "#0077b6",
              border: "1.5px solid",
              borderColor: showCompare ? "#0077b6" : "#cce4f6",
            }}
            onMouseEnter={(e) => {
              if (!showCompare) {
                e.currentTarget.style.background = "#cce4f6";
              }
            }}
            onMouseLeave={(e) => {
              if (!showCompare) {
                e.currentTarget.style.background = "#e8f4fd";
              }
            }}
          >
            <div className="flex items-center gap-2.5">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 6h18M3 12h18M3 18h18"
                />
              </svg>
              Compare with other devices
            </div>
            <svg
              className="w-4 h-4 transition-transform duration-300"
              style={{
                transform: showCompare ? "rotate(180deg)" : "rotate(0deg)",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showCompare && <CompareDevices initialProduct={product} />}
        </div>

        {/* ── Recently Viewed Products ── */}
        {recentlyViewed.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-black text-[#0077b6] uppercase tracking-wider">Browsing History</span>
                <h3 className="text-lg font-extrabold text-slate-900">Recently Viewed Devices</h3>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {recentlyViewed.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  className="bg-white rounded-2xl border border-slate-100 p-3 hover:border-blue-200 hover:shadow-md transition cursor-pointer flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 flex items-center justify-center mb-2 overflow-hidden">
                    <LazyImage
                      src={getDeviceImage(item)}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#0077b6]">{item.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-extrabold text-[#0077b6]">₹{item.price?.toLocaleString("en-IN")}</span>
                    {item.condition && (
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1 py-0.2 rounded">
                        {item.condition}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Reviews ── */}
        <ReviewSection
          productId={id}
          user={user}
          isAuthenticated={isAuthenticated}
          productOwnerId={product.listedBy?._id ?? product.listedBy}
        />
      </div>

      {/* ── Modals ── */}
      <ConditionGuideModal
        isOpen={showConditionGuideModal}
        onClose={() => setShowConditionGuideModal(false)}
      />

      <InspectionModal
        isOpen={showInspectionModal}
        onClose={() => setShowInspectionModal(false)}
        product={product}
      />

      <ExchangeModal
        isOpen={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        product={product}
        onApplyExchange={(ex) => setSelectedExchange(ex)}
      />

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
