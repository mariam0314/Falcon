import { useState, useEffect } from "react";
import { getCustomersAdmin } from "../../../../services/admin.api";

export default function CustomersTab({ showToast }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await getCustomersAdmin();
      if (res.success) {
        setCustomers(res.customers || []);
      }
    } catch (err) {
      showToast?.(err.message || "Failed to load customers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const name = `${c.firstname || ""} ${c.lastname || ""}`.toLowerCase();
    const email = (c.email || "").toLowerCase();
    const phone = (c.mobile || "").toLowerCase();
    const q = search.trim().toLowerCase();
    return !q || name.includes(q) || email.includes(q) || phone.includes(q);
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
            Registered Customers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Directory of verified customer profiles, contact numbers, and saved shipping addresses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            Total Customers: <span className="text-[#1132d4] font-black">{customers.length}</span>
          </span>
          <button
            onClick={fetchCustomers}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-[0_2px_12px_rgba(17,50,212,0.03)] flex items-center justify-between">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            placeholder="Search customer by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1132d4] focus:bg-white transition-all"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>
      </div>

      {/* Customers List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-36 bg-white rounded-2xl border border-slate-100" />
          ))}
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-3xl mb-2">👥</p>
          <p className="text-sm font-bold text-slate-700">No customers found</p>
          <p className="text-xs text-slate-400 mt-1">Try another search keyword</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((c) => {
            const fullName = `${c.firstname || ""} ${c.lastname || ""}`.trim() || "Customer";
            const initials = `${c.firstname?.[0] || ""}${c.lastname?.[0] || ""}`.toUpperCase() || "U";
            const address = c.defaultAddress
              ? [c.defaultAddress.street, c.defaultAddress.city, c.defaultAddress.pincode].filter(Boolean).join(", ")
              : "No default address saved";

            return (
              <div
                key={c._id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_12px_rgba(17,50,212,0.03)] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1132d4] font-black text-sm flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-extrabold text-slate-800 truncate">
                        {fullName}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{c.email}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Mobile:</span>
                      <span className="font-bold text-slate-800">{c.mobile || "—"}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-400 flex-shrink-0">Address:</span>
                      <span className="font-medium text-slate-700 text-right line-clamp-1">
                        {address}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    ● Active Customer
                  </span>
                  <span>
                    Joined:{" "}
                    {new Date(c.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
