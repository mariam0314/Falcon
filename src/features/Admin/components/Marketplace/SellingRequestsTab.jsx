import { useState, useEffect } from "react";
import {
  getSellingRequests,
  updateSellingRequestStatus,
} from "../../../../services/admin.api";

const fmt = (n) => (n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

const STATUS_FILTERS = [
  { id: "all", label: "All Requests" },
  { id: "scheduled", label: "Scheduled" },
  { id: "agent_assigned", label: "Agent Assigned" },
  { id: "inspected", label: "Inspected" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export default function SellingRequestsTab({ showToast }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getSellingRequests();
      if (res.success) {
        setRequests(res.requests || []);
      }
    } catch (err) {
      showToast?.(err.message || "Failed to load selling requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    setUpdatingId(requestId);
    try {
      const res = await updateSellingRequestStatus(requestId, newStatus);
      if (res.success) {
        showToast?.(`Selling request status updated to ${newStatus.replace("_", " ")}`);
        fetchRequests();
      }
    } catch (err) {
      showToast?.(err.message || "Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const st = r.status === "available" ? (r.pickup?.status === "scheduled" ? "scheduled" : "scheduled") : r.status;
    const matchesFilter =
      activeFilter === "all" ||
      st === activeFilter ||
      (activeFilter === "scheduled" && (r.status === "available" || r.pickup?.status === "scheduled"));

    const reqId = (r.requestId || (r._id ? `FEL-SELL-${r._id.slice(-6).toUpperCase()}` : "")).toLowerCase();
    const phone = (r.pickup?.contactPhone || r.contactPhone || r.listedBy?.mobile || "").toLowerCase();
    const name = (r.pickup?.contactName || r.contactName || `${r.listedBy?.firstname || ""} ${r.listedBy?.lastname || ""}`).toLowerCase();
    const model = `${r.brand || ""} ${r.model || ""}`.toLowerCase();
    const q = search.trim().toLowerCase();

    const matchesSearch = !q || reqId.includes(q) || phone.includes(q) || name.includes(q) || model.includes(q);

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
            Doorstep Selling Requests
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review customer sell bookings, verify evaluation condition, and update pickup inspection stages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            Total Requests: <span className="text-[#1132d4] font-black">{requests.length}</span>
          </span>
          <button
            onClick={fetchRequests}
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
            placeholder="Search Request ID, mobile, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1132d4] focus:bg-white transition-all"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-white rounded-2xl border border-slate-100" />
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-3xl mb-2">🤝</p>
          <p className="text-sm font-bold text-slate-700">No selling requests match this criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try selecting another filter or clearing the search</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((r) => {
            const reqId = r.requestId || (r._id ? `FEL-SELL-${r._id.slice(-6).toUpperCase()}` : "FEL-SELL");
            const customerName = r.pickup?.contactName || r.contactName || `${r.listedBy?.firstname || ""} ${r.listedBy?.lastname || ""}`.trim() || "Customer";
            const customerPhone = r.pickup?.contactPhone || r.contactPhone || r.listedBy?.mobile || "—";
            const pickupSlot = `${r.pickup?.date || r.pickup?.confirmedSlot?.date || "Tomorrow"} (${r.pickup?.timeRange || r.pickup?.confirmedSlot?.timeRange || "10:00 AM - 01:00 PM"})`;
            const pickupAddress = [r.pickup?.address || r.pickupAddress, r.pickup?.city, r.pickup?.pincode].filter(Boolean).join(", ") || "Doorstep Address Provided";

            const currentStatus = r.status === "available" ? "scheduled" : r.status;

            return (
              <div
                key={r._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_12px_rgba(17,50,212,0.03)] hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Left Device & Customer Details */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-16 h-18 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {r.image ? (
                      <img src={r.image} alt={r.model} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl">📱</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-[#1132d4] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                        {reqId}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold uppercase">
                        {r.category || "mobile"}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(r.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-800 leading-snug">
                      {r.brand} {r.model}
                      {(r.ram || r.storage) && (
                        <span className="ml-2 text-xs font-normal text-slate-500">
                          ({[r.ram, r.storage].filter(Boolean).join(" / ")})
                        </span>
                      )}
                    </h3>

                    {/* Customer info */}
                    <div className="text-xs text-slate-600 flex items-center gap-3 pt-1 flex-wrap">
                      <span className="font-semibold text-slate-800">👤 {customerName}</span>
                      <span>📞 {customerPhone}</span>
                    </div>

                    {/* Pickup Address */}
                    <div className="text-xs text-slate-500 flex items-start gap-1 pt-0.5">
                      <span className="font-bold text-slate-600 flex-shrink-0">📍 Pickup:</span>
                      <span className="line-clamp-1">{pickupAddress} · <span className="font-semibold text-blue-700">{pickupSlot}</span></span>
                    </div>

                    {/* Defects reported */}
                    {r.evaluation?.defects?.length > 0 && (
                      <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/60 rounded-lg px-2 py-1 mt-1 inline-block">
                        ⚠️ Reported: {r.evaluation.defects.map((d) => d.label).join(", ")}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Price & Lifecycle Stage Controls */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 gap-3 flex-shrink-0">
                  <div className="text-left lg:text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Resale Valuation
                    </p>
                    <p className="text-lg sm:text-xl font-black text-slate-900">
                      {fmt(r.finalPrice)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={currentStatus}
                      disabled={updatingId === r._id}
                      onChange={(e) => handleStatusChange(r._id, e.target.value)}
                      className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                        currentStatus === "completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                          : currentStatus === "inspected"
                            ? "bg-teal-50 text-teal-700 border-teal-300"
                            : currentStatus === "agent_assigned"
                              ? "bg-sky-50 text-sky-700 border-sky-300"
                              : currentStatus === "cancelled"
                                ? "bg-red-50 text-red-600 border-red-300"
                                : "bg-blue-50 text-[#1132d4] border-blue-300"
                      }`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="agent_assigned">Agent Assigned</option>
                      <option value="inspected">Device Inspected</option>
                      <option value="completed">Completed / Paid</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    {updatingId === r._id && (
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
