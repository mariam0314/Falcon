//Sell|Success

// src/pages/sell/SellSuccess.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function SellSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const listing  = location.state?.listing;

  useEffect(() => { toast.success("Pickup scheduled successfully! 🎉"); }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center space-y-5">

        {/* Checkmark */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto"
          style={{ background: "#e8f4fd", border: "1px solid #cce4f6" }}>
          <svg className="w-8 h-8" style={{ color: "#0077b6" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-600 border border-emerald-200 mb-2">
            Pickup Confirmed
          </span>
          <h2 className="text-xl font-bold text-gray-900">Doorstep Pickup Scheduled!</h2>
          <p className="text-sm text-gray-500 mt-1">
            Our certified executive will arrive at your address to inspect the device and transfer instant cash.
          </p>
        </div>

        {listing && (
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-sm space-y-2 text-left">
            <Row label="Request ID" value={listing.requestId || `FEL-SELL-${listing.listingId?.slice(-6)?.toUpperCase()}`} mono highlight />
            <Row label="Device"     value={listing.device} />
            <Row label="Estimated Payout" value={`₹${listing.finalPrice?.toLocaleString("en-IN")}`} bold />
            {listing.pickup?.date && <Row label="Pickup Date" value={listing.pickup.date} />}
            {listing.pickup?.timeRange && <Row label="Time Slot" value={listing.pickup.timeRange} />}
            {listing.pickup?.address && <Row label="Pickup Address" value={`${listing.pickup.address}, ${listing.pickup.city || ""}`} />}
            <Row label="Inspection Status" value="Scheduled (Pending Handover)" />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 transition"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition"
            style={{ background: "#0077b6" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#005f8f"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#0077b6"; }}
          >
            Track Selling Request
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono, bold, highlight }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className={`text-xs ${mono ? "font-mono font-semibold" : ""} ${bold ? "font-bold text-blue-600" : "text-gray-700"} ${highlight ? "text-blue-700 bg-blue-50 px-2 py-0.5 rounded" : ""}`}>
        {value}
      </span>
    </div>
  );
}