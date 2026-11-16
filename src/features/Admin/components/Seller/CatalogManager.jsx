import { useState, useEffect, useRef, useCallback } from "react";
import { buildApiUrl, BASE_URL } from "../../../../services/api.config";

const CATEGORIES = ["mobile", "laptop", "tablet", "smartwatch", "television"];
const token = () => localStorage.getItem("accessToken");
const BLUE = "#1132d4";

async function apiFetch(path, opts = {}) {
  const { headers: extraHeaders, ...restOpts } = opts;
  const res = await fetch(buildApiUrl(path), {
    ...restOpts,
    headers: { Authorization: `Bearer ${token()}`, ...extraHeaders },
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.message || "Request failed");
  return d;
}

async function apiMultipart(path, fd) {
  const res = await fetch(buildApiUrl(path), {
    method: "POST",
    headers: { Authorization: `Bearer ${token()}` },
    body: fd,
  });
  const d = await res.json();
  if (!res.ok) throw new Error(d.message || "Request failed");
  return d;
}

const VARIANT_FIELDS = {
  mobile:     [{ key: "ram", label: "RAM", ph: "8 GB" }, { key: "storage", label: "Storage", ph: "128 GB" }],
  laptop:     [{ key: "ram", label: "RAM", ph: "16 GB" }, { key: "storage", label: "Storage", ph: "512 GB SSD" }],
  tablet:     [{ key: "ram", label: "RAM", ph: "4 GB" }, { key: "storage", label: "Storage", ph: "64 GB" }, { key: "connectivity", label: "Connectivity", ph: "Wi-Fi Only" }],
  smartwatch: [{ key: "caseSize", label: "Case Size", ph: "44mm" }, { key: "connectivity", label: "Connectivity", ph: "GPS Only" }],
  television: [{ key: "screenSize", label: "Screen Size", ph: "55\"" }, { key: "resolution", label: "Resolution", ph: "4K UHD" }],
};

const Spinner = ({ size = 14 }) => (
  <span style={{ display: "inline-block", width: size, height: size, border: "2px solid #e2e8f0", borderTopColor: BLUE, borderRadius: "50%", animation: "catalogSpin .7s linear infinite", flexShrink: 0 }} />
);

const inp = {
  width: "100%", fontSize: 13, padding: "8px 10px",
  border: "1.5px solid #e2e8f0", borderRadius: 8,
  outline: "none", boxSizing: "border-box", background: "#fff",
};

// ─── Variant Editor ───────────────────────────────────────────────────────────
function VariantEditor({ category, variants, onChange }) {
  const fields = VARIANT_FIELDS[category] || [{ key: "spec", label: "Spec", ph: "" }];
  const add    = () => onChange([...variants, { specs: {}, basePrice: 0 }]);
  const remove = (i) => onChange(variants.filter((_, idx) => idx !== i));
  const setSpec  = (i, k, v) => { const a = [...variants]; a[i] = { ...a[i], specs: { ...a[i].specs, [k]: v } }; onChange(a); };
  const setPrice = (i, v)    => { const a = [...variants]; a[i] = { ...a[i], basePrice: parseInt(v) || 0 }; onChange(a); };

  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Variants</span>
        <button type="button" onClick={add} style={{ fontSize: 11, fontWeight: 700, color: BLUE, background: "#e8f0fe", border: "none", borderRadius: 6, padding: "3px 9px", cursor: "pointer" }}>+ Add</button>
      </div>
      {variants.length === 0 && <p style={{ fontSize: 12, color: "#94a3b8", margin: "8px 0" }}>No variants — click Add</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {variants.map((v, i) => (
          <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 10px" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
              {fields.map((f) => (
                <div key={f.key} style={{ flex: "1 1 70px" }}>
                  <label style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, display: "block", marginBottom: 2 }}>{f.label}</label>
                  <input value={v.specs?.[f.key] || ""} onChange={(e) => setSpec(i, f.key, e.target.value)} placeholder={f.ph} style={{ ...inp, fontSize: 12, padding: "4px 7px" }} />
                </div>
              ))}
              <div style={{ flex: "1 1 70px" }}>
                <label style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, display: "block", marginBottom: 2 }}>Price ₹</label>
                <input type="number" value={v.basePrice || ""} onChange={(e) => setPrice(i, e.target.value)} placeholder="15000" style={{ ...inp, fontSize: 12, padding: "4px 7px" }} />
              </div>
            </div>
            <button type="button" onClick={() => remove(i)} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0 }}>✕ Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Inline Model Form ────────────────────────────────────────────────────────
function ModelForm({ catalog, model, onClose, onSaved, showToast }) {
  const isEdit = !!model;
  const [name, setName]         = useState(model?.name || "");
  const [variants, setVariants] = useState(
    model?.variants?.map((v) => ({
      ...v,
      specs: v.specs instanceof Map ? Object.fromEntries(v.specs) : (v.specs || {}),
    })) || []
  );
  const [imgFile, setImgFile]       = useState(null);
  const [imgPreview, setImgPreview] = useState(model?.image || null);
  const [saving, setSaving]         = useState(false);
  const fileRef = useRef();

  const save = async () => {
    if (!name.trim()) { showToast("Model name required", "error"); return; }
    if (!variants.length) { showToast("Add at least one variant", "error"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("brand", catalog.brand);
      fd.append("category", catalog.category);
      fd.append("modelName", name.trim());
      fd.append("variants", JSON.stringify(variants));
      if (isEdit) fd.append("modelId", model._id);
      if (imgFile) fd.append("image", imgFile);
      else if (imgPreview) fd.append("existingImage", imgPreview);
      await apiMultipart("/device-sell/admin/catalog/model", fd);
      showToast(isEdit ? "Model updated" : "Model added");
      onSaved();
      onClose();
    } catch (e) { showToast(e.message, "error"); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 16px", marginTop: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{isEdit ? `Edit: ${model.name}` : "Add New Model"}</span>
        <button onClick={onClose} style={{ background: "#e2e8f0", border: "none", borderRadius: 6, width: 24, height: 24, cursor: "pointer", fontSize: 12, color: "#64748b" }}>✕</button>
      </div>

      {/* Name */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>Model Name *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. iPhone 16 Pro" style={inp}
          onFocus={(e) => (e.target.style.borderColor = BLUE)} onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")} />
      </div>

      {/* Image */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>Image</label>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {imgPreview
            ? <img src={imgPreview} alt="" style={{ width: 40, height: 52, objectFit: "contain", borderRadius: 6, border: "1px solid #e2e8f0", background: "#fff" }} />
            : <div style={{ width: 40, height: 52, borderRadius: 6, border: "1.5px dashed #e2e8f0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📷</div>
          }
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button type="button" onClick={() => fileRef.current?.click()}
              style={{ fontSize: 11, fontWeight: 600, color: BLUE, background: "#e8f0fe", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}>
              {imgPreview ? "Change" : "Upload"}
            </button>
            {imgPreview && (
              <button type="button" onClick={() => { setImgFile(null); setImgPreview(null); }}
                style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
            )}
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) { setImgFile(f); setImgPreview(URL.createObjectURL(f)); } }} />
          </div>
        </div>
      </div>

      {/* Variants */}
      <VariantEditor category={catalog.category} variants={variants} onChange={setVariants} />

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 600, color: "#64748b", cursor: "pointer" }}>Cancel</button>
        <button onClick={save} disabled={saving}
          style={{ flex: 2, padding: "8px", borderRadius: 8, border: "none", background: saving ? "#e2e8f0" : BLUE, color: saving ? "#94a3b8" : "#fff", fontSize: 12, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {saving && <Spinner />}
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Model"}
        </button>
      </div>
    </div>
  );
}

// ─── Inline Brand Edit Form ───────────────────────────────────────────────────
function BrandEditForm({ catalog, onClose, onSaved, showToast }) {
  const [brand, setBrand]       = useState(catalog.brand);
  const [category, setCategory] = useState(catalog.category);
  const [saving, setSaving]     = useState(false);

  const save = async () => {
    if (!brand.trim()) { showToast("Brand name required", "error"); return; }
    setSaving(true);
    try {
      // Delete old + create new if brand name changed, else just re-POST (addBrandCatalog merges)
      if (brand.trim() !== catalog.brand || category !== catalog.category) {
        // Create new catalog entry with same models
        await apiFetch("/device-sell/admin/catalog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand: brand.trim(), category, models: catalog.models || [] }),
        });
        // Delete old if brand/category changed
        if (brand.trim() !== catalog.brand || category !== catalog.category) {
          await apiFetch(`/device-sell/admin/catalog/${encodeURIComponent(catalog.brand)}/${catalog.category}`, { method: "DELETE" });
        }
      }
      showToast("Brand updated");
      onSaved();
      onClose();
    } catch (e) { showToast(e.message, "error"); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ background: "#f0f4ff", border: "1.5px solid #c7d2fe", borderRadius: 10, padding: "14px 16px", marginTop: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Edit Brand</span>
        <button onClick={onClose} style={{ background: "#e2e8f0", border: "none", borderRadius: 6, width: 24, height: 24, cursor: "pointer", fontSize: 12, color: "#64748b" }}>✕</button>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <div style={{ flex: "1 1 140px" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>Brand Name</label>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} style={inp}
            onFocus={(e) => (e.target.style.borderColor = BLUE)} onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")} />
        </div>
        <div style={{ flex: "1 1 120px" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inp }}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 600, color: "#64748b", cursor: "pointer" }}>Cancel</button>
        <button onClick={save} disabled={saving}
          style={{ flex: 2, padding: "8px", borderRadius: 8, border: "none", background: saving ? "#e2e8f0" : BLUE, color: saving ? "#94a3b8" : "#fff", fontSize: 12, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {saving && <Spinner />}
          {saving ? "Saving…" : "Save Brand"}
        </button>
      </div>
    </div>
  );
}

// ─── Catalog Row ──────────────────────────────────────────────────────────────
function CatalogRow({ catalog, onDelete, onDeleteModel, showToast, onRefresh }) {
  const [open, setOpen]           = useState(false);
  const [modelForm, setModelForm] = useState(null); // null | "new" | model obj
  const [editBrand, setEditBrand] = useState(false);

  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>

      {/* Brand header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
        {/* Clickable area to expand */}
        <div onClick={() => setOpen((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, cursor: "pointer", userSelect: "none" }}>
          {catalog.logo
            ? <img src={catalog.logo} alt={catalog.brand} style={{ width: 28, height: 28, objectFit: "contain", borderRadius: 6, border: "1px solid #f1f5f9", flexShrink: 0 }} />
            : <div style={{ width: 28, height: 28, borderRadius: 6, background: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>📱</div>
          }
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{catalog.brand}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{catalog.models?.length || 0} models · <span style={{ textTransform: "capitalize" }}>{catalog.category}</span></p>
          </div>
        </div>

        {/* Action buttons */}
        <button onClick={(e) => { e.stopPropagation(); setEditBrand((v) => !v); setModelForm(null); }}
          style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", background: "#f5f3ff", border: "none", borderRadius: 6, padding: "4px 9px", cursor: "pointer" }}>
          {editBrand ? "✕" : "Edit Brand"}
        </button>
        <button onClick={(e) => { e.stopPropagation(); setModelForm(modelForm === "new" ? null : "new"); setEditBrand(false); }}
          style={{ fontSize: 11, fontWeight: 700, color: BLUE, background: "#e8f0fe", border: "none", borderRadius: 6, padding: "4px 9px", cursor: "pointer" }}>
          {modelForm === "new" ? "✕" : "+ Model"}
        </button>
        <button onClick={(e) => { e.stopPropagation(); if (window.confirm(`Delete ${catalog.brand} ${catalog.category}?`)) onDelete(catalog.brand, catalog.category); }}
          style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", background: "#fef2f2", border: "none", borderRadius: 6, padding: "4px 9px", cursor: "pointer" }}>Del</button>
        <span onClick={() => setOpen((v) => !v)} style={{ fontSize: 11, color: "#94a3b8", cursor: "pointer", userSelect: "none" }}>{open ? "▲" : "▼"}</span>
      </div>

      {/* Inline brand edit */}
      {editBrand && (
        <div style={{ padding: "0 14px 10px" }}>
          <BrandEditForm
            catalog={catalog}
            onClose={() => setEditBrand(false)}
            onSaved={onRefresh}
            showToast={showToast}
          />
        </div>
      )}

      {/* Inline new model form */}
      {modelForm === "new" && (
        <div style={{ padding: "0 14px 10px" }}>
          <ModelForm
            catalog={catalog}
            model={null}
            onClose={() => setModelForm(null)}
            onSaved={onRefresh}
            showToast={showToast}
          />
        </div>
      )}

      {/* Models list */}
      {open && (
        <div style={{ borderTop: "1px solid #f1f5f9" }}>
          {(!catalog.models || catalog.models.length === 0) && (
            <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", padding: "14px 0" }}>No models yet</p>
          )}
          {catalog.models?.map((m) => (
            <ModelRowItem
              key={m._id}
              m={m}
              catalog={catalog}
              onDeleteModel={onDeleteModel}
              showToast={showToast}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Individual model row with inline edit ────────────────────────────────────
function ModelRowItem({ m, catalog, onDeleteModel, showToast, onRefresh }) {
  const [editing, setEditing] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid #f8fafc" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px" }}>
        {m.image
          ? <img src={m.image} alt={m.name} style={{ width: 28, height: 36, objectFit: "contain", borderRadius: 5, border: "1px solid #f1f5f9", flexShrink: 0 }} />
          : <div style={{ width: 28, height: 36, borderRadius: 5, background: "#f8fafc", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>📦</div>
        }
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</p>
          <p style={{ margin: 0, fontSize: 10, color: "#94a3b8" }}>{m.variants?.length || 0} variants · {m.soldCount || 0} sold</p>
        </div>
        <button onClick={() => setEditing((v) => !v)}
          style={{ fontSize: 11, color: BLUE, background: "#e8f0fe", border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontWeight: 600 }}>
          {editing ? "✕" : "Edit"}
        </button>
        <button onClick={() => { if (window.confirm(`Delete "${m.name}"?`)) onDeleteModel(catalog.brand, catalog.category, m._id); }}
          style={{ fontSize: 11, color: "#ef4444", background: "#fef2f2", border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontWeight: 600 }}>Del</button>
      </div>

      {/* Inline model edit form */}
      {editing && (
        <div style={{ padding: "0 14px 10px" }}>
          <ModelForm
            catalog={catalog}
            model={m}
            onClose={() => setEditing(false)}
            onSaved={onRefresh}
            showToast={showToast}
          />
        </div>
      )}
    </div>
  );
}

// ─── Add Brand inline form ────────────────────────────────────────────────────
function AddBrandForm({ onClose, onSaved, showToast }) {
  const [brand, setBrand]       = useState("");
  const [category, setCategory] = useState("mobile");
  const [creating, setCreating] = useState(false);

  const create = async () => {
    if (!brand.trim()) { showToast("Brand name required", "error"); return; }
    setCreating(true);
    try {
      await apiFetch("/device-sell/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: brand.trim(), category, models: [] }),
      });
      showToast(`${brand} catalog created`);
      onSaved();
      onClose();
    } catch (e) { showToast(e.message, "error"); }
    finally { setCreating(false); }
  };

  return (
    <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Add New Brand Catalog</span>
        <button onClick={onClose} style={{ background: "#e2e8f0", border: "none", borderRadius: 6, width: 24, height: 24, cursor: "pointer", fontSize: 12, color: "#64748b" }}>✕</button>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <div style={{ flex: "1 1 140px" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>Brand Name *</label>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Apple, Samsung" style={inp}
            onFocus={(e) => (e.target.style.borderColor = BLUE)} onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            onKeyDown={(e) => e.key === "Enter" && create()} />
        </div>
        <div style={{ flex: "1 1 120px" }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inp }}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onClose} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 600, color: "#64748b", cursor: "pointer" }}>Cancel</button>
        <button onClick={create} disabled={creating}
          style={{ flex: 2, padding: "8px", borderRadius: 8, border: "none", background: creating ? "#e2e8f0" : "#16a34a", color: creating ? "#94a3b8" : "#fff", fontSize: 12, fontWeight: 700, cursor: creating ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {creating && <Spinner />}
          {creating ? "Creating…" : "Create Catalog"}
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CatalogManager({ showToast }) {
  const [catalogs, setCatalogs]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [catFilter, setCatFilter]   = useState("all");
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);
  const [pagination, setPagination] = useState({});
  const [showAddBrand, setShowAddBrand] = useState(false);

  const fetchCatalogs = useCallback(async (p = 1) => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams({ page: p, limit: 20 });
      if (catFilter !== "all") params.set("category", catFilter);
      if (search.trim()) params.set("brand", search.trim());
      const res = await apiFetch(`/device-sell/admin/catalogs?${params}`);
      setCatalogs(res.data);
      setPagination(res.pagination);
      setPage(p);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [catFilter, search]);

  useEffect(() => { fetchCatalogs(1); }, [catFilter]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@keyframes catalogSpin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Device Catalog</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0" }}>Manage brands, models and variants for the sell flow</p>
        </div>
        <button onClick={() => setShowAddBrand((v) => !v)}
          style={{ fontSize: 12, fontWeight: 700, padding: "8px 16px", borderRadius: 10, border: "none", background: showAddBrand ? "#e2e8f0" : BLUE, color: showAddBrand ? "#64748b" : "#fff", cursor: "pointer" }}>
          {showAddBrand ? "✕ Cancel" : "+ Add Brand"}
        </button>
      </div>

      {/* Inline add brand form */}
      {showAddBrand && (
        <AddBrandForm
          onClose={() => setShowAddBrand(false)}
          onSaved={() => fetchCatalogs(1)}
          showToast={showToast}
        />
      )}

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
        <div style={{ flex: "1 1 160px", display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 9, padding: "7px 10px" }}>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchCatalogs(1)}
            placeholder="Search brand… (Enter)" style={{ flex: 1, border: "none", outline: "none", fontSize: 12, color: "#0f172a", background: "transparent" }} />
        </div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {["all", ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCatFilter(c)}
              style={{ fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 99, border: "1.5px solid", cursor: "pointer", textTransform: "capitalize",
                background: catFilter === c ? BLUE : "#fff", color: catFilter === c ? "#fff" : "#64748b", borderColor: catFilter === c ? BLUE : "#e2e8f0" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9, padding: "9px 12px", fontSize: 13, color: "#dc2626", marginBottom: 12 }}>⚠ {error}</div>}

      {!loading && <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>{pagination.total || 0} brands · page {pagination.page || 1}/{pagination.totalPages || 1}</p>}

      {/* List */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ height: 56, background: "#f8fafc", borderRadius: 12, opacity: 1 - i * 0.15 }} />
          ))}
        </div>
      ) : catalogs.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "40px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 28, marginBottom: 6 }}>📦</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>No catalogs found</p>
        </div>
      ) : (
        catalogs.map((c) => (
          <CatalogRow
            key={`${c.brand}-${c.category}`}
            catalog={c}
            onDelete={async (brand, cat) => {
              try {
                await apiFetch(`/device-sell/admin/catalog/${encodeURIComponent(brand)}/${cat}`, { method: "DELETE" });
                showToast(`${brand} deleted`);
                fetchCatalogs(page);
              } catch (e) { showToast(e.message, "error"); }
            }}
            onDeleteModel={async (brand, cat, modelId) => {
              try {
                await apiFetch(`/device-sell/admin/catalog/${encodeURIComponent(brand)}/${cat}/models/${modelId}`, { method: "DELETE" });
                showToast("Model deleted");
                fetchCatalogs(page);
              } catch (e) { showToast(e.message, "error"); }
            }}
            showToast={showToast}
            onRefresh={() => fetchCatalogs(page)}
          />
        ))
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
          <button disabled={!pagination.hasPrev} onClick={() => fetchCatalogs(page - 1)}
            style={{ fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: pagination.hasPrev ? "pointer" : "not-allowed", opacity: pagination.hasPrev ? 1 : 0.4 }}>← Prev</button>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Page {page} of {pagination.totalPages}</span>
          <button disabled={!pagination.hasNext} onClick={() => fetchCatalogs(page + 1)}
            style={{ fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: pagination.hasNext ? "pointer" : "not-allowed", opacity: pagination.hasNext ? 1 : 0.4 }}>Next →</button>
        </div>
      )}
    </div>
  );
}