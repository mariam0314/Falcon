import { useState, useEffect } from "react";
import {
  getCouponsAdmin,
  createCouponAdmin,
  toggleCouponAdmin,
} from "../../../../services/admin.api";

const fmt = (n) => (n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

export default function CouponsTab({ showToast }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Form states
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState(10000);
  const [maxDiscount, setMaxDiscount] = useState(5000);
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await getCouponsAdmin();
      if (res.success) {
        setCoupons(res.coupons || []);
      }
    } catch (err) {
      showToast?.(err.message || "Failed to load coupons", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleToggle = async (id) => {
    setTogglingId(id);
    try {
      const res = await toggleCouponAdmin(id);
      if (res.success) {
        showToast?.(`Coupon ${res.coupon.code} is now ${res.coupon.isActive ? "Active" : "Inactive"}`);
        fetchCoupons();
      }
    } catch (err) {
      showToast?.(err.message || "Failed to toggle coupon", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) {
      showToast?.("Coupon code and discount value are required", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await createCouponAdmin({
        code: code.trim().toUpperCase(),
        description: description.trim(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        isActive: true,
      });
      if (res.success) {
        showToast?.(`Coupon ${res.coupon.code} created successfully!`);
        setShowModal(false);
        setCode("");
        setDescription("");
        setDiscountValue("");
        fetchCoupons();
      }
    } catch (err) {
      showToast?.(err.message || "Failed to create coupon", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Promotional Coupons &amp; Discount Offers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure promotional discount vouchers, minimum cart thresholds, and percentage caps for customer checkout.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#1132d4] hover:bg-[#0d28b8] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(17,50,212,0.3)] flex items-center gap-2"
          >
            <span>+</span> Create Coupon
          </button>
          <button
            onClick={fetchCoupons}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Coupons Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-white rounded-2xl border border-slate-100" />
          ))}
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-3xl mb-2">🎟️</p>
          <p className="text-sm font-bold text-slate-700">No discount coupons found</p>
          <p className="text-xs text-slate-400 mt-1">Create promotional coupons to drive checkout conversion</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {coupons.map((c) => {
            const isPct = c.discountType === "percentage";
            return (
              <div
                key={c._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_12px_rgba(17,50,212,0.03)] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-sm font-black text-[#1132d4] bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-lg">
                      {c.code}
                    </span>
                    <button
                      onClick={() => handleToggle(c._id)}
                      disabled={togglingId === c._id}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full transition-all ${
                        c.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {togglingId === c._id ? "..." : c.isActive ? "● Active" : "○ Inactive"}
                    </button>
                  </div>

                  <p className="text-lg font-black text-slate-900">
                    {isPct ? `${c.discountValue}% OFF` : `Flat ${fmt(c.discountValue)} OFF`}
                  </p>
                  {c.description && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{c.description}</p>
                  )}

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span>Min Order:</span>
                      <span className="font-bold text-slate-700">{fmt(c.minOrderAmount)}</span>
                    </div>
                    {isPct && c.maxDiscount && (
                      <div className="flex items-center justify-between">
                        <span>Max Cap:</span>
                        <span className="font-bold text-slate-700">{fmt(c.maxDiscount)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Redeemed:</span>
                      <span className="font-bold text-blue-600">{c.usedCount || 0} times</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 text-[10px] text-slate-400">
                  {c.isActive ? "Live in customer checkout drawer" : "Disabled (hidden at checkout)"}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeUp_0.2s_ease]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">
                  Create Promotional Coupon
                </h3>
                <p className="text-xs text-slate-400">
                  Add a new coupon code for instant checkout deductions
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVE2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none focus:border-[#1132d4]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Special festive celebration discount"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#1132d4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === "percentage" ? "e.g. 10" : "e.g. 1000"}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Min Cart Order (₹)
                  </label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#1132d4] text-white text-xs font-bold hover:bg-[#0d28b8] disabled:opacity-50 transition-all shadow-sm"
                >
                  {submitting ? "Creating..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
