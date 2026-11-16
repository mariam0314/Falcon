// SellDevices.jsx — Responsive + Sort

import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import {
  faShieldAlt,
  faBolt,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSellFlow } from "../../../context/sellflow.context";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";

const benefits = [
  {
    icon: faShieldAlt,
    title: "Safe & Secure",
    description:
      "Select your device & we'll help you unlock the best selling price based on the present conditions of your gadget & the current market price.",
  },
  {
    icon: faBolt,
    title: "Instant Payment",
    description:
      "On accepting the price offered for your device, we'll arrange a free pick up.",
  },
  {
    icon: faMoneyBillWave,
    title: "Best Price",
    description:
      "Instant Cash will be handed over to you at time of pickup or through payment mode of your choice.",
  },
];

// ─── Extract generation number from model name ────────────────────────────────
// "iPhone 16 Pro" → 16, "Galaxy S25" → 25, "iPad Air 5th Gen" → 5
// Strategy: find all numbers in name, return the largest one as generation proxy
function extractGen(name = "") {
  const nums = name.match(/\d+/g);
  if (!nums) return 0;
  return Math.max(...nums.map(Number));
}

// ─── Get min base price across all variants ───────────────────────────────────
function getMinPrice(model) {
  if (!model.variants?.length) return 0;
  return Math.min(...model.variants.map((v) => v.basePrice ?? 0));
}

const SORT_OPTIONS = [
  { value: "default",       label: "Default" },
  { value: "newest",        label: "Newest First" },
  { value: "oldest",        label: "Oldest First" },
  { value: "name_asc",      label: "Name: A → Z" },
  { value: "name_desc",     label: "Name: Z → A" },
];

function sortModels(models, sortBy) {
  if (sortBy === "default") return models;
  return [...models].sort((a, b) => {
    switch (sortBy) {
      case "newest":     return extractGen(b.name) - extractGen(a.name);
      case "oldest":     return extractGen(a.name) - extractGen(b.name);
      case "name_asc":   return a.name.localeCompare(b.name);
      case "name_desc":  return b.name.localeCompare(a.name);
      default:           return 0;
    }
  });
}

export default function SellDevices({
  models = [],
  brand,
  category,
  loading = false,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSelectedModel } = useSellFlow();
  const [query, setQuery]         = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [sortBy, setSortBy]       = useState("default");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (user?.role === "seller") {
    return <SellerCannotSellPage />;
  }

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = () => setDropdownOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [dropdownOpen]);

  const displayName = (modelName) => {
    if (!modelName || !brand) return modelName;
    const b = brand.trim();
    return modelName.toLowerCase().startsWith(b.toLowerCase())
      ? modelName
      : `${b} ${modelName}`;
  };

  const handleSelect = (model) => {
    if (!model?.id || !model?.name) {
      toast.error("Invalid model selected");
      return;
    }
    setSelectedModel({
      id: model.id,
      name: displayName(model.name),
      image: model.image,
      soldCount: model.soldCount,
    });
    navigate("/sell/variant");
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(models)) return [];
    const searched = models.filter((m) =>
      displayName(m?.name)?.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
    return sortModels(searched, sortBy);
  }, [models, debouncedQuery, brand, sortBy]);

  const selectedLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Sort";

  return (
    <>
      <style>{`
        @media(max-width:640px){
          .sd-header { padding: 24px 16px 0 !important; }
          .sd-header h2 { font-size: 22px !important; }
          .sd-controls { flex-direction: column !important; gap: 10px !important; }
          .sd-search-wrap input { width: 100% !important; }
          .sd-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .sd-model-card { padding: 12px 8px !important; }
          .sd-model-img  { width: 60px !important; height: 88px !important; }
          .sd-benefits { padding: 24px 16px !important; }
          .sd-benefits h2 { font-size: 22px !important; }
          .sd-benefits-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
        @media(min-width:641px) and (max-width:1024px){
          .sd-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .sd-benefits-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        .sd-dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          min-width: 190px;
          z-index: 50;
          overflow: hidden;
        }
        .sd-dropdown-item {
          display: block;
          width: 100%;
          padding: 10px 16px;
          font-size: 13px;
          text-align: left;
          border: none;
          background: none;
          cursor: pointer;
          color: #374151;
          transition: background .12s;
        }
        .sd-dropdown-item:hover { background: #f0f9ff; color: #0077b6; }
        .sd-dropdown-item.active { background: #e8f4fd; color: #0077b6; font-weight: 700; }
        .sd-dropdown-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }
      `}</style>

      <section className="sd-header bg-gray-50 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Sell Old {brand}</h2>

          {/* Controls row: search + sort */}
          <div className="sd-controls flex items-center justify-between gap-3 mb-6">
            {/* Search */}
            <input
              value={query}
              onChange={(e) => {
                const v = e.target.value;
                if (v.length <= 50) setQuery(v);
              }}
              type="text"
              placeholder="Search model"
              className="border rounded-lg px-4 py-2 focus:ring focus:ring-teal-300"
              style={{ width: "100%", maxWidth: 260 }}
            />

            {/* Sort dropdown */}
            <div style={{ position: "relative", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  border: "1.5px solid",
                  borderColor: sortBy !== "default" ? "#0077b6" : "#e2e8f0",
                  borderRadius: 10,
                  background: sortBy !== "default" ? "#e8f4fd" : "#fff",
                  color: sortBy !== "default" ? "#0077b6" : "#374151",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all .15s",
                }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M9 17h6" />
                </svg>
                {selectedLabel}
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="sd-dropdown-menu">
                  {/* Group 1: default */}
                  <button className={`sd-dropdown-item${sortBy === "default" ? " active" : ""}`}
                    onClick={() => { setSortBy("default"); setDropdownOpen(false); }}>
                    Default
                  </button>
                  <div className="sd-dropdown-divider" />

                  {/* Group 2: by model generation */}
                  <div style={{ padding: "4px 16px 2px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>By Model</div>
                  <button className={`sd-dropdown-item${sortBy === "newest" ? " active" : ""}`}
                    onClick={() => { setSortBy("newest"); setDropdownOpen(false); }}>
                    Newest First
                  </button>
                  <button className={`sd-dropdown-item${sortBy === "oldest" ? " active" : ""}`}
                    onClick={() => { setSortBy("oldest"); setDropdownOpen(false); }}>
                    Oldest First
                  </button>
                  <div className="sd-dropdown-divider" />

                  {/* Group 3: by name */}
                  <div style={{ padding: "4px 16px 2px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>By Name</div>
                  <button className={`sd-dropdown-item${sortBy === "name_asc" ? " active" : ""}`}
                    onClick={() => { setSortBy("name_asc"); setDropdownOpen(false); }}>
                    A → Z
                  </button>
                  <button className={`sd-dropdown-item${sortBy === "name_desc" ? " active" : ""}`}
                    onClick={() => { setSortBy("name_desc"); setDropdownOpen(false); }}>
                    Z → A
                  </button>
                  <div className="sd-dropdown-divider" />
                </div>
              )}
            </div>
          </div>

          {/* Results count */}
          {!loading && models.length > 0 && (
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>
              {filtered.length} model{filtered.length !== 1 ? "s" : ""}
              {sortBy !== "default" && <span> · sorted by <strong style={{ color: "#0077b6" }}>{selectedLabel}</strong></span>}
            </p>
          )}

          {loading ? (
            <p className="text-center py-12">Loading models...</p>
          ) : models.length === 0 ? (
            <p className="text-center text-gray-400 py-12">
              No models found for {brand}.
            </p>
          ) : (
            <div className="sd-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
              {filtered.map((model) => (
                <div
                  key={model.id || model.name}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelect(model)}
                  className="sd-model-card flex flex-col items-center bg-white rounded-lg shadow p-4 hover:shadow-md cursor-pointer transition"
                >
                  <div className="sd-model-img w-45 h-35 flex items-center justify-center mb-2">
                    {model.image ? (
                      <img
                        src={model.image}
                        alt={model.name}
                        className="object-contain h-full"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/fallback-device.png";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-24 bg-gray-100 rounded-lg" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-700 text-center">
                    {displayName(model.name)}
                  </p>
                  {model.soldCount > 0 && (
                    <p className="text-xs text-teal-600 mt-1">
                      {model.soldCount.toLocaleString("en-IN")}+ sold
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {filtered.length === 0 && models.length > 0 && (
            <p className="text-center text-gray-400 py-6">
              No results for "{query}"
            </p>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="sd-benefits bg-gray-50 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Why Sell On FELCON?
          </h2>
          <div className="sd-benefits-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <div key={i} className="flex flex-col items-center text-center bg-white rounded-lg shadow p-6 hover:shadow-md transition">
                <FontAwesomeIcon icon={b.icon} className="text-teal-600 text-5xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}