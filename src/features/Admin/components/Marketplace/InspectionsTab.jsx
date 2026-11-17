import { useState, useEffect } from "react";
import {
  getDeviceInspections,
  runDeviceInspection,
  getAllProductsAdmin,
} from "../../../../services/admin.api";

export default function InspectionsTab({ showToast }) {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [deviceTitle, setDeviceTitle] = useState("");
  const [brand, setBrand] = useState("Apple");
  const [category, setCategory] = useState("mobile");
  const [batteryHealth, setBatteryHealth] = useState(96);
  const [grade, setGrade] = useState("Superb");
  const [pointsPassed, setPointsPassed] = useState(32);
  const [submitting, setSubmitting] = useState(false);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const res = await getDeviceInspections();
      if (res.success) {
        setInspections(res.inspections || []);
      }
    } catch (err) {
      showToast?.(err.message || "Failed to load inspections", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
    getAllProductsAdmin({ limit: 100 }).then((res) => {
      if (res.success) setProducts(res.products || []);
    }).catch(() => {});
  }, []);

  const handleProductSelect = (e) => {
    const id = e.target.value;
    setSelectedProductId(id);
    const prod = products.find((p) => p._id === id);
    if (prod) {
      setDeviceTitle(prod.title);
      setBrand(prod.brand || "Apple");
      setCategory(prod.category || "mobile");
      setBatteryHealth(prod.batteryHealth || 95);
      setGrade(prod.condition || "Superb");
    }
  };

  const handleRunInspection = async (e) => {
    e.preventDefault();
    if (!deviceTitle.trim()) {
      showToast?.("Device title is required", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await runDeviceInspection({
        productId: selectedProductId || undefined,
        deviceTitle,
        brand,
        category,
        batteryHealthPercentage: Number(batteryHealth),
        cosmeticCondition: grade,
        pointsPassed: Number(pointsPassed),
        workflowStatus: "inventory_approved",
      });
      if (res.success) {
        showToast?.(`32-Point Inspection completed! Certificate ${res.inspection.certificateId} issued.`);
        setShowModal(false);
        fetchInspections();
      }
    } catch (err) {
      showToast?.(err.message || "Failed to create inspection record", "error");
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
            32-Point Refurbishment &amp; Quality Inspection
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Certified hardware diagnostics covering Display, Battery, Camera, Audio, Connectivity, and UV Sanitization.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#1132d4] hover:bg-[#0d28b8] text-white text-xs font-bold transition-all shadow-[0_2px_8px_rgba(17,50,212,0.3)] flex items-center gap-2"
          >
            <span>+</span> Run 32-Pt Inspection
          </button>
          <button
            onClick={fetchInspections}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      {/* 32 Checkpoints Summary Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-[#1132d4] rounded-2xl p-5 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase bg-white/20 px-2.5 py-1 rounded-full text-white">
              FELCON Quality Assurance Standard
            </span>
            <h3 className="text-lg font-black mt-2">
              6 Diagnostic Pillars · 32 Comprehensive Checkpoints
            </h3>
            <p className="text-xs text-blue-100 mt-0.5 max-w-xl">
              1. Physical &amp; Frame Integrity · 2. OLED Display &amp; Multitouch · 3. Battery Health &amp; Charging Cycle · 4. Camera &amp; Sensors · 5. Audio &amp; Microphones · 6. 100% Medical-Grade UV Sanitization
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
              <p className="text-2xl font-black">{inspections.length}</p>
              <p className="text-[10px] uppercase font-bold text-blue-200">Certified Records</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inspections Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 bg-white rounded-2xl border border-slate-100" />
          ))}
        </div>
      ) : inspections.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-3xl mb-2">🛡️</p>
          <p className="text-sm font-bold text-slate-700">No inspection records found</p>
          <p className="text-xs text-slate-400 mt-1">Run an inspection to issue the first certificate</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inspections.map((ins) => {
            const passPct = Math.round((ins.pointsPassed / (ins.totalPoints || 32)) * 100);
            return (
              <div
                key={ins._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_12px_rgba(17,50,212,0.03)] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Certificate ID & Status */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-black text-[#1132d4] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                      {ins.certificateId}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Approved
                    </span>
                  </div>

                  {/* Device Title & Brand */}
                  <h4 className="text-sm font-extrabold text-slate-800 line-clamp-1">
                    {ins.deviceTitle || ins.product?.title || "Refurbished Device"}
                  </h4>
                  <p className="text-xs text-slate-400 uppercase font-semibold mt-0.5">
                    {ins.brand} · {ins.category}
                  </p>

                  {/* Score & Battery stats */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Checkpoints</p>
                      <p className="font-black text-slate-800 mt-0.5">
                        {ins.pointsPassed}/32 Passed <span className="text-emerald-600 font-bold">({passPct}%)</span>
                      </p>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Battery Health</p>
                      <p className="font-black text-emerald-600 mt-0.5">
                        🔋 {ins.batteryHealthPercentage || 95}%
                      </p>
                    </div>
                  </div>

                  {/* Cosmetic Condition */}
                  <div className="flex items-center justify-between text-xs mt-3">
                    <span className="text-slate-500 font-medium">Cosmetic Grade:</span>
                    <span className="font-black text-[#1132d4] bg-blue-50 px-2 py-0.5 rounded-md">
                      {ins.cosmeticCondition || "Superb"}
                    </span>
                  </div>
                </div>

                {/* Footer inspector info */}
                <div className="pt-3 mt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Inspector: {ins.inspectorName || "FELCON Lab"}</span>
                  <span>
                    {new Date(ins.certifiedAt || ins.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Run Inspection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-[fadeUp_0.2s_ease]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">
                  Run 32-Point Quality Certification
                </h3>
                <p className="text-xs text-slate-400">
                  Perform comprehensive diagnostics and issue a verified quality certificate
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRunInspection} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Select From Existing Inventory (Optional)
                </label>
                <select
                  value={selectedProductId}
                  onChange={handleProductSelect}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                >
                  <option value="">-- Or enter custom device below --</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} ({p.brand} - {p.condition})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Device Title *
                </label>
                <input
                  type="text"
                  required
                  value={deviceTitle}
                  onChange={(e) => setDeviceTitle(e.target.value)}
                  placeholder="e.g. Apple iPhone 15 Pro 128GB Blue Titanium"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                  >
                    <option value="mobile">Smartphones</option>
                    <option value="laptop">Laptops</option>
                    <option value="tablet">Tablets</option>
                    <option value="watch">Smartwatches</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Battery Health
                  </label>
                  <input
                    type="number"
                    min="70"
                    max="100"
                    value={batteryHealth}
                    onChange={(e) => setBatteryHealth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Condition Grade
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Superb">Superb</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Points Passed
                  </label>
                  <input
                    type="number"
                    min="28"
                    max="32"
                    value={pointsPassed}
                    onChange={(e) => setPointsPassed(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                  />
                </div>
              </div>

              <div className="px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800">
                ✓ Once verified, the device will automatically receive the "32-Point Quality Certified" badge on the storefront.
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
                  {submitting ? "Processing..." : "Issue Quality Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
