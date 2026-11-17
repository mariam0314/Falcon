import { useState, useEffect } from "react";
import {
  getAllProductsAdmin,
  updateProductAdmin,
  adminDeleteProduct,
} from "../../../../services/admin.api";

const fmt = (n) => (n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

const CONDITIONS = ["Like New", "Superb", "Good", "Fair"];
const CATEGORIES = [
  { id: "", label: "All Categories" },
  { id: "mobile", label: "Smartphones" },
  { id: "laptop", label: "Laptops" },
  { id: "tablet", label: "Tablets" },
  { id: "smartwatch", label: "Smartwatches" },
];

export default function InventoryTab({ showToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editCondition, setEditCondition] = useState("");
  const [editBattery, setEditBattery] = useState("");
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProductsAdmin({
        category: selectedCategory || undefined,
        condition: selectedCondition || undefined,
        search: search.trim() || undefined,
        page,
        limit: 24,
      });
      if (res.success) {
        setProducts(res.products || []);
        setPagination(res.pagination || { total: res.products?.length || 0, totalPages: 1 });
      }
    } catch (err) {
      showToast?.(err.message || "Failed to load inventory", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedCondition, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setEditPrice(p.price || "");
    setEditStock(p.stock !== undefined ? p.stock : 1);
    setEditCondition(p.condition || "Like New");
    setEditBattery(p.batteryHealth || 95);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    setUpdating(true);
    try {
      const res = await updateProductAdmin(editingProduct._id, {
        price: Number(editPrice),
        stock: Number(editStock),
        condition: editCondition,
        batteryHealth: Number(editBattery),
      });
      if (res.success) {
        showToast?.("Device listing updated successfully");
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (err) {
      showToast?.(err.message || "Failed to update product", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the marketplace catalogue?`)) {
      return;
    }
    try {
      await adminDeleteProduct(id);
      showToast?.("Product removed from inventory");
      fetchProducts();
    } catch (err) {
      showToast?.(err.message || "Failed to delete product", "error");
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
            Refurbished Inventory Catalogue
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage genuine released devices (2022–2026), pricing, stock, battery health, and quality grades.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
            Total In Stock: <span className="text-[#1132d4] font-black">{pagination.total}</span>
          </span>
          <button
            onClick={fetchProducts}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
            title="Refresh"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-[0_2px_12px_rgba(17,50,212,0.03)] space-y-4">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCategory(c.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? "bg-[#1132d4] text-white shadow-[0_2px_8px_rgba(17,50,212,0.25)]"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Condition Filter & Search Input */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-400 mr-1">Grade:</span>
            <button
              onClick={() => {
                setSelectedCondition("");
                setPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                selectedCondition === ""
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {CONDITIONS.map((cond) => (
              <button
                key={cond}
                onClick={() => {
                  setSelectedCondition(cond);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCondition === cond
                    ? "bg-[#1132d4] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cond}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="w-full sm:w-72 relative">
            <input
              type="text"
              placeholder="Search by brand or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1132d4] focus:bg-white transition-all"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
          </form>
        </div>
      </div>

      {/* Inventory Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-64 bg-white rounded-2xl border border-slate-100" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-3xl mb-2">📦</p>
          <p className="text-sm font-bold text-slate-700">No products found</p>
          <p className="text-xs text-slate-400 mt-1">Try clearing filters or search keyword</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => {
            const hasStock = (p.stock ?? 1) > 0 && p.status === "available";
            return (
              <div
                key={p._id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-[0_4px_20px_rgba(17,50,212,0.06)] transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#1132d4] border border-blue-200/60">
                      {p.condition || "Like New"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        hasStock
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-600 border border-red-200"
                      }`}
                    >
                      {hasStock ? `${p.stock ?? 1} in stock` : "Sold Out"}
                    </span>
                  </div>

                  {/* Product Image */}
                  <div className="w-full h-36 bg-slate-50/60 rounded-xl flex items-center justify-center p-2 mb-3 overflow-hidden">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-3xl opacity-30">📱</span>
                    )}
                  </div>

                  {/* Brand & Year */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
                    <span className="uppercase">{p.brand}</span>
                    <span>{p.releaseYear || "2024"}</span>
                  </div>

                  {/* Title */}
                  <h4 className="text-xs font-extrabold text-slate-800 line-clamp-2 leading-tight">
                    {p.title}
                  </h4>

                  {/* Battery & 32-Pt Certified */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px]">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      🔋 {p.batteryHealth || 95}% Health
                    </span>
                    {p.inspectionCertified && (
                      <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        ✓ 32-Pt Certified
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer price & actions */}
                <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-900">{fmt(p.price)}</p>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <p className="text-[10px] text-slate-400 line-through">
                        {fmt(p.originalPrice)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-blue-50 text-[#1132d4] border border-slate-200 hover:border-blue-300 transition-all shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id, p.title)}
                      className="px-2 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Delete Product"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
          >
            ← Previous
          </button>
          <span className="text-xs font-bold text-slate-500">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
          >
            Next →
          </button>
        </div>
      )}

      {/* Quick Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeUp_0.2s_ease]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Edit Inventory Device</h3>
                <p className="text-xs text-slate-400 truncate max-w-xs">{editingProduct.title}</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Refurbished Price (₹)
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Battery Health (%)
                  </label>
                  <input
                    type="number"
                    min="70"
                    max="100"
                    value={editBattery}
                    onChange={(e) => setEditBattery(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Condition Grade
                </label>
                <select
                  value={editCondition}
                  onChange={(e) => setEditCondition(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1132d4]"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={updating}
                className="px-5 py-2 rounded-xl bg-[#1132d4] text-white text-xs font-bold hover:bg-[#0d28b8] disabled:opacity-50 transition-all flex items-center gap-1.5"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
