import { useState, useEffect } from "react";
import { getDashboardAnalytics } from "../../../../services/admin.api";

const fmt = (n) => (n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

export default function AnalyticsTab({ showToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await getDashboardAnalytics();
      if (res.success && res.analytics) {
        setData(res.analytics);
      }
    } catch (err) {
      showToast?.(err.message || "Failed to load analytics", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-100 p-4" />
          ))}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-slate-100" />
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Marketplace Revenue",
      value: fmt(data?.totalRevenue || 0),
      subtitle: "Verified platform payments",
      icon: "💰",
      bg: "bg-blue-50/60",
      border: "border-blue-100",
      color: "text-[#1132d4]",
    },
    {
      label: "Total Orders Placed",
      value: (data?.totalOrders || 0).toLocaleString("en-IN"),
      subtitle: `${data?.productsSold || 0} delivered to customers`,
      icon: "📦",
      bg: "bg-sky-50/60",
      border: "border-sky-100",
      color: "text-sky-700",
    },
    {
      label: "Refurbished Inventory",
      value: (data?.totalInventory || 0).toLocaleString("en-IN"),
      subtitle: "Active certified devices",
      icon: "📱",
      bg: "bg-emerald-50/60",
      border: "border-emerald-100",
      color: "text-emerald-700",
    },
    {
      label: "Registered Customers",
      value: (data?.totalCustomers || 0).toLocaleString("en-IN"),
      subtitle: "Verified customer accounts",
      icon: "👥",
      bg: "bg-indigo-50/60",
      border: "border-indigo-100",
      color: "text-indigo-700",
    },
    {
      label: "Selling Requests",
      value: (data?.sellingRequests || 0).toLocaleString("en-IN"),
      subtitle: "Doorstep pickup bookings",
      icon: "🤝",
      bg: "bg-purple-50/60",
      border: "border-purple-100",
      color: "text-purple-700",
    },
    {
      label: "Exchange Trade-Ins",
      value: (data?.exchangeRequests || 0).toLocaleString("en-IN"),
      subtitle: "Old device trade-ins applied",
      icon: "🔄",
      bg: "bg-amber-50/60",
      border: "border-amber-100",
      color: "text-amber-700",
    },
    {
      label: "Pending Fulfillment",
      value: (data?.pendingOrders || 0).toLocaleString("en-IN"),
      subtitle: "In inspection / packing",
      icon: "⏳",
      bg: "bg-orange-50/60",
      border: "border-orange-100",
      color: "text-orange-700",
    },
    {
      label: "Devices Delivered",
      value: (data?.productsSold || 0).toLocaleString("en-IN"),
      subtitle: "Successful handovers",
      icon: "✅",
      bg: "bg-teal-50/60",
      border: "border-teal-100",
      color: "text-teal-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2
            className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Marketplace Analytics &amp; KPIs
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time business performance metrics across buying, selling, and exchanges.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
        >
          <span>↻</span> Refresh Metrics
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`${kpi.bg} border ${kpi.border} rounded-2xl p-4 shadow-[0_2px_12px_rgba(17,50,212,0.03)] transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{kpi.icon}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                KPI
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 line-clamp-1">{kpi.label}</p>
            <p className={`text-xl sm:text-2xl font-black mt-1 ${kpi.color}`}>
              {kpi.value}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">{kpi.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Analytics Charts & Most Popular Devices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_16px_rgba(17,50,212,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                Monthly Marketplace Sales (2026)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Revenue trends across refurbished electronic categories
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
              6-Month Overview
            </span>
          </div>

          <div className="space-y-4">
            {data?.monthlySales?.map((m) => {
              const maxRev = 5000000;
              const pct = Math.min(100, Math.round((m.revenue / maxRev) * 100));
              return (
                <div key={m.month} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">{m.month}</span>
                    <span className="font-mono font-extrabold text-[#1132d4]">
                      {fmt(m.revenue)}{" "}
                      <span className="text-slate-400 font-normal">({m.orders} orders)</span>
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1132d4] to-[#0077b6] rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Popular Refurbished Devices */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_16px_rgba(17,50,212,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-800">Popular Devices</h3>
              <span className="text-[11px] font-bold text-slate-400">Top Rated</span>
            </div>

            <div className="space-y-3">
              {data?.mostPopularProducts?.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
                >
                  <div className="w-11 h-11 rounded-lg bg-white border border-slate-200 p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-lg">📱</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{p.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        {p.brand}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700">
                        {p.condition || "Like New"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-black text-slate-900">{fmt(p.price)}</p>
                    <p className="text-[10px] text-amber-500 font-bold">★ {p.rating || 4.8}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Pricing engine automatically recalibrates according to market velocity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
