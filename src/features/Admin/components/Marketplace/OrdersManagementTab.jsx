import { useState, useEffect } from "react";
import {
  getAllOrders,
  updateOrderLifecycle,
} from "../../../../services/admin.api";

const fmt = (n) => (n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

const STAGES = [
  { id: "all", label: "All Orders" },
  { id: "confirmed", label: "Confirmed" },
  { id: "processing", label: "Processing" },
  { id: "quality_check", label: "Quality Check" },
  { id: "packed", label: "Packed" },
  { id: "shipped", label: "Shipped" },
  { id: "out_for_delivery", label: "Out for Delivery" },
  { id: "delivered", label: "Delivered" },
];

export default function OrdersManagementTab({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [courierPartner, setCourierPartner] = useState("BlueDart Express");
  const [trackingId, setTrackingId] = useState("");
  const [savingTracking, setSavingTracking] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders({ limit: 50 });
      if (res.orders) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      showToast?.(err.message || "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStageChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderLifecycle(orderId, { status: newStatus });
      if (res.success) {
        showToast?.(`Order moved to ${newStatus.replace(/_/g, " ")}`);
        fetchOrders();
      }
    } catch (err) {
      showToast?.(err.message || "Failed to advance lifecycle", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenTrackingModal = (o) => {
    setTrackingModalOrder(o);
    setCourierPartner(o.courier?.partner || "BlueDart Express");
    setTrackingId(o.courier?.trackingId || "");
  };

  const handleSaveTracking = async (e) => {
    e.preventDefault();
    if (!trackingModalOrder) return;
    setSavingTracking(true);
    try {
      const res = await updateOrderLifecycle(trackingModalOrder._id, {
        status: trackingModalOrder.status,
        courierPartner,
        trackingId,
      });
      if (res.success) {
        showToast?.("Courier tracking details updated successfully");
        setTrackingModalOrder(null);
        fetchOrders();
      }
    } catch (err) {
      showToast?.(err.message || "Failed to update courier tracking", "error");
    } finally {
      setSavingTracking(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStage = activeStage === "all" || o.status === activeStage;
    const orderId = (o._id || "").toLowerCase();
    const buyer = `${o.buyer?.firstname || ""} ${o.buyer?.lastname || ""}`.toLowerCase();
    const tracking = (o.courier?.trackingId || "").toLowerCase();
    const product = (o.product?.title || "").toLowerCase();
    const q = search.trim().toLowerCase();

    const matchesSearch = !q || orderId.includes(q) || buyer.includes(q) || tracking.includes(q) || product.includes(q);

    return matchesStage && matchesSearch;
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
            Refurbished Orders &amp; 7-Stage Fulfillment
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Advance orders through the 7-stage fulfillment lifecycle, assign BlueDart Express tracking, and monitor door deliveries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            Total Orders: <span className="text-[#1132d4] font-black">{orders.length}</span>
          </span>
          <button
            onClick={fetchOrders}
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
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStage(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeStage === s.id
                  ? "bg-[#1132d4] text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="Search Order ID, buyer, tracking..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1132d4] focus:bg-white transition-all"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-white rounded-2xl border border-slate-100" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-3xl mb-2">📦</p>
          <p className="text-sm font-bold text-slate-700">No orders match this criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try another filter stage or clear search</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((o) => {
            const customerName = o.shippingAddress?.name || `${o.buyer?.firstname || ""} ${o.buyer?.lastname || ""}`.trim() || "Customer";
            const phone = o.shippingAddress?.phone || o.buyer?.mobile || "—";
            const destination = [o.shippingAddress?.address, o.shippingAddress?.city, o.shippingAddress?.pincode].filter(Boolean).join(", ");
            const tracking = o.courier?.trackingId || `FEL-TRK-${o._id?.slice(-8).toUpperCase()}`;
            const currentStatus = o.status || "confirmed";

            return (
              <div
                key={o._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_12px_rgba(17,50,212,0.03)] hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                {/* Product & Order info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-16 h-18 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {o.product?.images?.[0] ? (
                      <img src={o.product.images[0]} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl">📱</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-[#1132d4] bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                        #{o._id?.slice(-10).toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {o.exchange?.isExchange && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          🔄 Exchange: −{fmt(o.exchange.value)}
                        </span>
                      )}
                      {o.coupon?.code && (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          🎟️ {o.coupon.code}: −{fmt(o.coupon.discountAmount)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-800 leading-snug line-clamp-1">
                      {o.product?.title || "Refurbished Electronics Device"}
                    </h3>

                    {/* Customer & Destination */}
                    <div className="text-xs text-slate-600 flex items-center gap-3 pt-0.5 flex-wrap">
                      <span className="font-semibold text-slate-800">👤 {customerName}</span>
                      <span>📞 {phone}</span>
                      {destination && <span className="text-slate-400">📍 {destination}</span>}
                    </div>

                    {/* Courier info row */}
                    <div className="flex items-center gap-2 text-xs pt-1 flex-wrap">
                      <span className="font-bold text-blue-900 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded">
                        🚚 {o.courier?.partner || "BlueDart Express"}
                      </span>
                      <span className="font-mono text-slate-600 font-bold select-all">
                        AWB: {tracking}
                      </span>
                      <button
                        onClick={() => handleOpenTrackingModal(o)}
                        className="text-[11px] font-bold text-[#1132d4] hover:underline ml-1"
                      >
                        Edit Tracking
                      </button>
                    </div>
                  </div>
                </div>

                {/* Amount & 7-Stage Dropdown */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 gap-3 flex-shrink-0">
                  <div className="text-left lg:text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Total Paid
                    </p>
                    <p className="text-lg sm:text-xl font-black text-[#1132d4]">
                      {fmt(o.finalPayable || o.salePrice)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={currentStatus}
                      disabled={updatingId === o._id}
                      onChange={(e) => handleStageChange(o._id, e.target.value)}
                      className="text-xs font-bold px-3 py-2 rounded-xl border bg-slate-50 border-slate-200 text-slate-800 hover:border-[#1132d4] focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="confirmed">1. Confirmed</option>
                      <option value="processing">2. Processing</option>
                      <option value="quality_check">3. Quality Check</option>
                      <option value="packed">4. Packed</option>
                      <option value="shipped">5. Shipped</option>
                      <option value="out_for_delivery">6. Out for Delivery</option>
                      <option value="delivered">7. Delivered</option>
                      <option value="cancelled">Cancelled</option>
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

      {/* Edit Courier Tracking Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[fadeUp_0.2s_ease]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800">
                Update Courier Tracking
              </h3>
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="p-5 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Courier Partner
                </label>
                <select
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                >
                  <option value="BlueDart Express">BlueDart Express</option>
                  <option value="Delhivery Express">Delhivery Express</option>
                  <option value="DTDC Courier">DTDC Courier</option>
                  <option value="Shadowfax">Shadowfax</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Tracking / AWB Number
                </label>
                <input
                  type="text"
                  required
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="e.g. FEL-BLUEDART-882910"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTracking}
                  className="px-5 py-2 rounded-xl bg-[#1132d4] text-white text-xs font-bold hover:bg-[#0d28b8] disabled:opacity-50 transition-all shadow-sm"
                >
                  {savingTracking ? "Saving..." : "Save Tracking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
