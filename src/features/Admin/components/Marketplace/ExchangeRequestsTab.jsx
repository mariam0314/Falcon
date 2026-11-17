import { useState, useEffect } from "react";
import {
  getExchangeRequests,
  updateExchangeRequestStatus,
} from "../../../../services/admin.api";

const fmt = (n) => (n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

const STATUS_FILTERS = [
  { id: "all", label: "All Exchanges" },
  { id: "pending", label: "Pending Verification" },
  { id: "verified", label: "Verified" },
  { id: "completed", label: "Completed" },
  { id: "rejected", label: "Rejected" },
];

export default function ExchangeRequestsTab({ showToast }) {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchExchanges = async () => {
    setLoading(true);
    try {
      const res = await getExchangeRequests();
      if (res.success) {
        setExchanges(res.exchanges || []);
      }
    } catch (err) {
      showToast?.(err.message || "Failed to load exchange requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await updateExchangeRequestStatus(orderId, newStatus);
      if (res.success) {
        showToast?.(`Exchange status updated to ${newStatus}`);
        fetchExchanges();
      }
    } catch (err) {
      showToast?.(err.message || "Failed to update exchange status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredExchanges = exchanges.filter((o) => {
    const st = o.exchange?.status || "pending";
    const matchesFilter = activeFilter === "all" || st === activeFilter;

    const orderId = (o._id || "").toLowerCase();
    const buyerName = `${o.buyer?.firstname || ""} ${o.buyer?.lastname || ""}`.toLowerCase();
    const phone = (o.buyer?.mobile || o.shippingAddress?.phone || "").toLowerCase();
    const oldDevice = `${o.exchange?.brand || ""} ${o.exchange?.model || ""}`.toLowerCase();
    const q = search.trim().toLowerCase();

    const matchesSearch = !q || orderId.includes(q) || buyerName.includes(q) || phone.includes(q) || oldDevice.includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Trade-In Exchange Requests
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review old electronic devices traded in by customers against refurbished device purchases.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            Total Trade-Ins: <span className="text-[#1132d4] font-black">{exchanges.length}</span>
          </span>
          <button
            onClick={fetchExchanges}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-[0_2px_12px_rgba(17,50,212,0.03)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === f.id
                  ? "bg-[#1132d4] text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="Search Order ID, customer, old device..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1132d4] focus:bg-white transition-all"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {/* Exchanges List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-white rounded-2xl border border-slate-100" />
          ))}
        </div>
      ) : filteredExchanges.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-3xl mb-2">🔄</p>
          <p className="text-sm font-bold text-slate-700">No trade-in exchanges found</p>
          <p className="text-xs text-slate-400 mt-1">Orders with old device trade-ins will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExchanges.map((o) => {
            const customerName = o.shippingAddress?.name || `${o.buyer?.firstname || ""} ${o.buyer?.lastname || ""}`.trim() || "Customer";
            const phone = o.shippingAddress?.phone || o.buyer?.mobile || "—";
            const currentStatus = o.exchange?.status || "pending";
            const destination = [o.shippingAddress?.address, o.shippingAddress?.city, o.shippingAddress?.pincode].filter(Boolean).join(", ");

            return (
              <div
                key={o._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_12px_rgba(17,50,212,0.03)] hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left Section: Purchased & Trade-in Details */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black text-[#1132d4] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                      #{o._id?.slice(-10).toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      🔄 Trade-In Attached
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Grid showing Purchased Device vs Trade-In Device */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Device Purchased */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Device Purchased
                      </p>
                      <p className="text-xs font-extrabold text-slate-800 line-clamp-1">
                        {o.product?.title || "Refurbished Electronics"}
                      </p>
                      <p className="text-xs font-black text-slate-900 mt-1">
                        {fmt(o.salePrice)}
                      </p>
                    </div>

                    {/* Old Device Exchanged */}
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                          Old Device Exchanged
                        </p>
                        <span className="text-[10px] font-black text-emerald-700">
                          {o.exchange?.condition || "Good"}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-emerald-950 line-clamp-1">
                        {o.exchange?.brand} {o.exchange?.model}
                      </p>
                      <p className="text-xs font-black text-emerald-700 mt-1">
                        Valuation: −{fmt(o.exchange?.value)}
                      </p>
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap pt-1">
                    <span className="font-semibold text-slate-800">👤 {customerName}</span>
                    <span>📞 {phone}</span>
                    {destination && <span className="text-slate-400">📍 {destination}</span>}
                  </div>
                </div>

                {/* Right Section: Final Payable and Status Dropdown */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 gap-3 flex-shrink-0">
                  <div className="text-left lg:text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Net Payable
                    </p>
                    <p className="text-lg sm:text-xl font-black text-[#1132d4]">
                      {fmt(o.finalPayable || o.salePrice - (o.exchange?.value || 0))}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={currentStatus}
                      disabled={updatingId === o._id}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                        currentStatus === "completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : currentStatus === "verified"
                            ? "bg-blue-50 text-[#1132d4] border-blue-300"
                            : currentStatus === "rejected"
                              ? "bg-red-50 text-red-600 border-red-300"
                              : "bg-amber-50 text-amber-700 border-amber-300"
                      }`}
                    >
                      <option value="pending">Pending Handover</option>
                      <option value="verified">Verified By Agent</option>
                      <option value="completed">Completed / Handed Over</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    {updatingId === o._id && (
                      <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
