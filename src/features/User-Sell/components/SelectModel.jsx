// src/pages/sell/SelectModel.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SellDevices from "../pages/SellDevices";
import { getModelsByBrand } from "../../../services/deviceSell.api";
import { getFallbackModels } from "../../../services/deviceCatalogFallback";
import { useSellFlow } from "../../../context/sellflow.context";

export default function SelectModel() {
  const { category = "mobile", brand = "Apple" } = useParams();
  const { setCategory, setSelectedBrand } = useSellFlow();

  const [models, setModels] = useState(() => getFallbackModels(brand, category));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCategory(category);
    setSelectedBrand(brand);
    getModelsByBrand(brand, category)
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setModels(res.data);
        }
      })
      .catch((err) => {
        console.warn("SelectModel notice:", err.message);
      })
      .finally(() => setLoading(false));
  }, [brand, category]);

  return (
    <div>
      {models.length > 0 ? (
        <SellDevices models={models} brand={brand} category={category} />
      ) : loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          Loading models…
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 text-red-500 gap-3">
          <p>{error}</p>
          <button
            onClick={() => navigate("/sell")}
            className="px-4 py-2 bg-[#0077b6] text-white rounded-lg text-sm"
          >
            ← Back to Brands
          </button>
        </div>
      ) : (
        <SellDevices models={[]} brand={brand} category={category} />
      )}
    </div>
  );
}
