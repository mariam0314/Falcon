// src/pages/sell/SellPhones.jsx
//
// Landing page for the sell flow.
// Fetches real brands from the API for the selected category.
// Clicking a brand navigates to /sell/:category/:brand (SelectModel).
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SellCard from "../components/SellCard";
import Feedback from "../../Auth/components/Feedback";
import FAQ from "../../Auth/components/FAQ";
import DownloadAppBanner from "../../Auth/components/DownloadAppBanner";
import Footer from "../../Auth/components/Footer";
import { getBrands } from "../../../services/deviceSell.api";
import { getFallbackBrands } from "../../../services/deviceCatalogFallback";
import { useSellFlow } from "../../../context/sellflow.context";
import { useAuth } from "../../../hooks/useAuth";
import SellerCannotSellPage from "./SellerCannotSellPage";

const CATEGORY = "laptop";
const initialFallback = getFallbackBrands(CATEGORY);
const defaultNames = initialFallback.map((b) => b.brand);
const defaultLogos = Object.fromEntries(
  initialFallback.filter((b) => b.logo).map((b) => [b.brand, b.logo])
);

export default function SellLaptops() {
  const navigate = useNavigate();
  const { setCategory, setSelectedBrand } = useSellFlow();
  const [brands, setBrands] = useState(defaultNames);
  const [brandLogos, setBrandLogos] = useState(defaultLogos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  if (user?.role === "seller") {
    return <SellerCannotSellPage />;
  }

  useEffect(() => {
    setCategory(CATEGORY);
    getBrands(CATEGORY)
      .then((res) => {
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          const names = res.data.map((b) => b.brand);
          const logos = Object.fromEntries(
            res.data.filter((b) => b.logo).map((b) => [b.brand, b.logo]),
          );
          setBrands(names);
          setBrandLogos(logos);
        }
      })
      .catch((err) => {
        console.warn("SellLaptops getBrands notice:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    navigate(`/sell/${CATEGORY}/${encodeURIComponent(brand)}`);
  };

  return (
    <>
      {/* ── Hero / search card ── */}
      <SellCard
        title="Sell Old Laptop for Instant Cash"
        brands={brands}
        brandLogos={brandLogos}
        brandsLoading={loading}
        brandsError={error}
        onBrandClick={handleBrandClick}
      />

      <Feedback />
      <FAQ />
      <DownloadAppBanner />
      <Footer />
    </>
  );
}
