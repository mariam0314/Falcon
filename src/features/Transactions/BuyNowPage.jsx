import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { buyProduct, applyCoupon } from "../../services/shop.api";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
);

// ─── icon helper ─────────────────────────────────────────────────────────────
const Ic = ({ d, className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);
const I = {
  arrow: "M10 19l-7-7m0 0l7-7m-7 7h18",
  shield:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  check: "M5 13l4 4L19 7",
  bolt: "M13 10V3L4 14h7v7l9-11h-7z",
  tag: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z",
};

const STRIPE_STYLE = {
  style: {
    base: {
      fontSize: "14px",
      color: "#1e293b",
      fontFamily: "inherit",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#ef4444" },
  },
};

const PAYMENT_METHODS = [
  { id: "Card", label: "Card", icon: "💳" },
  { id: "UPI", label: "UPI", icon: "📲" },
  { id: "NetBanking", label: "NetBanking", icon: "🏦" },
  { id: "Cash", label: "Cash on delivery", icon: "💵" },
];

const conditionColors = {
  Superb: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Good: "text-blue-700 bg-blue-50 border-blue-200",
  Fair: "text-amber-700 bg-amber-50 border-amber-200",
};

// ─── Inner form (needs Stripe context) ───────────────────────────────────────
function BuyForm({ product, exchange, onBack, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [method, setMethod] = useState("Card");
  const [name, setName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("SBI");
  const [processing, setProcessing] = useState(false);
  const [stripeErr, setStripeErr] = useState(null);
  const [apiErr, setApiErr] = useState(null);

  // User profile / shipping address
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();

  const [contactName,   setContactName]   = useState(storedUser.firstname ? `${storedUser.firstname} ${storedUser.lastname || ""}`.trim() : "");
  const [contactPhone,  setContactPhone]  = useState(storedUser.phone || storedUser.mobile || "");
  const [streetAddress, setStreetAddress] = useState(storedUser.defaultAddress?.street || "");
  const [city,          setCity]          = useState(storedUser.defaultAddress?.city || "New Delhi");
  const [pincode,       setPincode]       = useState(storedUser.defaultAddress?.pincode || "110001");

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon,   setAppliedCoupon]   = useState(null);
  const [couponLoading,   setCouponLoading]   = useState(false);
  const [couponMsg,       setCouponMsg]       = useState(null);

  const exchangeVal = exchange?.value || 0;
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const netBeforeTax = Math.max(0, product.price - exchangeVal - couponDiscount);
  const tax = Math.round(netBeforeTax * 0.18);
  const total = netBeforeTax + tax;

  const handleApplyCoupon = async (codeToApply) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponMsg(null);
    try {
      const res = await applyCoupon(code, product.price);
      if (res.success && res.data) {
        setAppliedCoupon(res.data);
        setCouponMsg({ type: "success", text: `Coupon "${res.data.code}" applied! You save ₹${res.data.discountAmount.toLocaleString("en-IN")}` });
        toast.success(`Coupon "${res.data.code}" applied!`);
      }
    } catch (err) {
      setCouponMsg({ type: "error", text: err.message || "Invalid coupon code" });
      toast.error(err.message || "Invalid coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    setCouponMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStripeErr(null);
    setApiErr(null);

    if (!contactName.trim() || !contactPhone.trim() || !streetAddress.trim() || !pincode.trim()) {
      setApiErr("Please complete your delivery address and contact information.");
      return;
    }

    setProcessing(true);

    try {
      if (method === "Card" && !name.trim()) {
        setStripeErr("Cardholder name is required");
        setProcessing(false);
        return;
      }
      if (method === "UPI" && !upiId.trim()) {
        setStripeErr("UPI ID is required");
        setProcessing(false);
        return;
      }
      if (method === "Card") {
        if (!stripe || !elements) {
          setProcessing(false);
          return;
        }
        const { error } = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardNumberElement),
          billing_details: { name },
        });
        if (error) {
          setStripeErr(error.message);
          setProcessing(false);
          return;
        }
      }

      const shippingAddress = {
        street: streetAddress.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        full: `${streetAddress.trim()}, ${city.trim()} - ${pincode.trim()}`,
        contactPhone: contactPhone.trim(),
      };

      const res = await buyProduct(product._id, {
        paymentMethod: method,
        paymentId: method === "Card" ? "card_simulated_success" : (method === "UPI" ? `upi_${Date.now()}` : null),
        shippingAddress,
        couponCode: appliedCoupon?.code,
        exchange: exchange ? { isExchange: true, device: exchange.device, value: exchange.value } : null,
      });

      onSuccess(res?.data || { product, orderId: "FEL-ORD-" + Math.floor(100000 + Math.random() * 900000) });
    } catch (err) {
      setApiErr(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  return (
    <div
      className="min-h-screen bg-[#f7f8fc]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-10 py-4 flex items-center gap-3 sticky top-0 z-20 shadow-[0_1px_8px_rgba(17,50,212,0.04)]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#1132d4] transition-colors"
        >
          <Ic d={I.arrow} className="w-4 h-4" /> Back to product
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Ic d={I.lock} className="w-3.5 h-3.5 text-[#1132d4]" />
          Secure Checkout
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
          <div className="mb-8">
            <p className="text-xs font-black text-[#1132d4] uppercase tracking-widest mb-1">
              Direct Purchase
            </p>
            <h1
              className="text-2xl font-extrabold text-slate-900"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Complete Your Order
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review product details, apply trade-in discounts, and choose delivery address
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Payment & Shipping */}
            <div className="lg:col-span-3 space-y-6">
              {/* Product summary card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(17,50,212,0.05)] p-5 flex gap-4 items-start">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-2xl opacity-20">📱</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {product.brand && (
                    <p className="text-[10px] font-black text-[#1132d4] uppercase tracking-widest">
                      {product.brand}
                    </p>
                  )}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mt-0.5 line-clamp-2">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {product.condition && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${conditionColors[product.condition] || "bg-slate-100 text-slate-600 border-slate-200"}`}
                      >
                        {product.condition} Grade
                      </span>
                    )}
                    {product.storage && (
                      <span className="text-xs text-slate-400">
                        {product.storage}
                      </span>
                    )}
                  </div>
                  <div className="flex items-end gap-2 mt-2 flex-wrap">
                    <span className="text-lg font-extrabold text-slate-900">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ₹{product.originalPrice?.toLocaleString("en-IN")}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="text-xs font-bold text-emerald-600">
                        {discount}% off
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Trade-In Banner if active */}
              {exchange && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Exchange Trade-In Applied</p>
                      <p className="text-xs text-emerald-700">{exchange.device} (−₹{exchange.value?.toLocaleString("en-IN")})</p>
                    </div>
                  </div>
                  <span className="text-xs font-black bg-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full">
                    −₹{exchange.value?.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {/* Shipping Address Section */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(17,50,212,0.05)] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1132d4] flex items-center justify-center font-bold text-xs">
                    📍
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800">
                    Delivery Address
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      placeholder="e.g. John Doe"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#1132d4]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      required
                      placeholder="10-digit mobile"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#1132d4]"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Street Address / Flat / Building
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    required
                    placeholder="House / Flat no., street, landmark"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#1132d4]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#1132d4]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:outline-none focus:border-[#1132d4]"
                    />
                  </div>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(17,50,212,0.05)] p-5">
                <h3 className="text-sm font-extrabold text-slate-800 mb-3">
                  Apply Coupon Code
                </h3>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div>
                      <span className="font-extrabold text-emerald-800 tracking-wide font-mono mr-2">{appliedCoupon.code}</span>
                      <span className="text-emerald-700">−₹{appliedCoupon.discountAmount?.toLocaleString("en-IN")} applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code (e.g. FELCON10)"
                        className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#1132d4]"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={couponLoading || !couponCodeInput.trim()}
                        className="px-4 py-2 rounded-xl bg-[#1132d4] text-white text-xs font-bold hover:bg-[#0d28b8] disabled:opacity-50 transition"
                      >
                        {couponLoading ? "Applying…" : "Apply"}
                      </button>
                    </div>

                    {/* Quick chips */}
                    <div className="flex gap-2 mt-2.5 flex-wrap">
                      {["FELCON10", "CASHIFY500", "WELCOME2026", "FESTIVE2000"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCouponCodeInput(c);
                            handleApplyCoupon(c);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] font-mono font-bold text-slate-700 transition"
                        >
                          {c}
                        </button>
                      ))}
                    </div>

                    {couponMsg && (
                      <p className={`text-xs mt-2 font-medium ${couponMsg.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                        {couponMsg.text}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Payment method selector */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(17,50,212,0.05)] p-5">
                <h3 className="text-sm font-extrabold text-slate-800 mb-4">
                  Payment Method
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        method === m.id
                          ? "border-[#1132d4] bg-[#1132d4]/5 text-[#1132d4]"
                          : "border-slate-200 text-slate-600 hover:border-[#1132d4]/40"
                      }`}
                    >
                      <span className="text-lg">{m.icon}</span>
                      <span className="text-xs">{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Card fields */}
                {method === "Card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1132d4]/30 focus:border-[#1132d4] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Card Number
                      </label>
                      <div className="w-full rounded-xl border border-slate-200 px-4 py-3 focus-within:ring-2 focus-within:ring-[#1132d4]/30 focus-within:border-[#1132d4] transition-all">
                        <CardNumberElement options={STRIPE_STYLE} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Expiry
                        </label>
                        <div className="rounded-xl border border-slate-200 px-4 py-3 focus-within:ring-2 focus-within:ring-[#1132d4]/30">
                          <CardExpiryElement options={STRIPE_STYLE} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          CVV
                        </label>
                        <div className="rounded-xl border border-slate-200 px-4 py-3 focus-within:ring-2 focus-within:ring-[#1132d4]/30">
                          <CardCvcElement options={STRIPE_STYLE} />
                        </div>
                      </div>
                    </div>
                    {stripeErr && (
                      <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
                        {stripeErr}
                      </p>
                    )}
                  </div>
                )}

                {method === "UPI" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1132d4]/30 focus:border-[#1132d4]"
                      />
                    </div>
                    <p className="text-xs text-slate-400">
                      Instant verification via UPI PSP / QR code simulation.
                    </p>
                  </div>
                )}

                {method === "NetBanking" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Select Bank
                    </label>
                    <select
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1132d4]/30"
                    >
                      {[
                        "SBI",
                        "HDFC",
                        "ICICI",
                        "Axis",
                        "Kotak",
                        "Yes Bank",
                      ].map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                )}

                {method === "Cash" && (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                    <p className="text-xs text-amber-700 font-medium">
                      Cash on Delivery — verified by BlueDart Express executive upon inspection.
                    </p>
                  </div>
                )}

                {apiErr && (
                  <p className="mt-4 text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
                    {apiErr}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(17,50,212,0.05)] p-6 sticky top-20 space-y-5">
                <h3
                  className="text-sm font-extrabold text-slate-800"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Order Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Refurbished Device</span>
                    <span className="font-semibold text-slate-800">
                      ₹{product.price?.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {exchangeVal > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span className="font-medium">Trade-In Valuation</span>
                      <span className="font-bold">−₹{exchangeVal.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                      <span className="font-medium">Coupon Discount ({appliedCoupon.code})</span>
                      <span className="font-bold">−₹{couponDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">GST (18%)</span>
                    <span className="font-semibold text-slate-800">
                      ₹{tax.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Express Delivery</span>
                    <span className="font-semibold text-emerald-600">Free (BlueDart)</span>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                    <span className="text-base font-extrabold text-slate-900">
                      Total Payable
                    </span>
                    <span className="text-2xl font-black text-[#1132d4]">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* What happens next */}
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-2.5">
                  <p className="text-xs font-bold text-slate-700">
                    Order Fulfillment Steps:
                  </p>
                  {[
                    "Instant Order Confirmation",
                    "32-Point Final Quality Check",
                    "BlueDart Express Dispatch with Live Tracking",
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-xs text-slate-500"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#1132d4]/10 text-[#1132d4] flex items-center justify-center font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      {step}
                    </div>
                  ))}
                </div>

                {/* Security */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Ic
                    d={I.shield}
                    className="w-4 h-4 text-[#1132d4] flex-shrink-0"
                  />
                  FELCON Assured · 6-Month Warranty Included
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={processing || (method === "Card" && !stripe)}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-[#1132d4] text-white font-extrabold text-sm shadow-[0_4px_20px_rgba(17,50,212,0.35)] hover:bg-[#0d28b8] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
                >
                  {processing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                      Confirming Order…
                    </>
                  ) : (
                    <>
                      <Ic d={I.lock} className="w-4 h-4" /> Place Order — ₹
                      {total.toLocaleString("en-IN")}
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  100% Genuine · Free 7-Day Returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ orderData, onDone }) {
  const navigate = useNavigate();
  const orderId = orderData?.orderId || orderData?.order?._id || "FEL-ORD-2026";
  const trackingId = orderData?.courier?.trackingId || "FEL-78291044";

  return (
    <div
      className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-5 p-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap');`}</style>
      <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center shadow-sm">
        <svg
          className="w-10 h-10 text-emerald-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <div className="text-center max-w-sm">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-2">
          Order Confirmed
        </span>
        <h2
          className="text-2xl font-extrabold text-slate-900"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Thank you for your order! 🎉
        </h2>
        <p className="text-slate-500 text-sm mt-1 leading-relaxed">
          Your refurbished device is being prepared at our fulfillment center. It will undergo final 32-point check before dispatch.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 max-w-sm w-full space-y-3 shadow-sm text-xs">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Order ID</span>
          <span className="font-mono font-bold text-slate-800">{orderId}</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Courier Partner</span>
          <span className="font-bold text-[#1132d4]">BlueDart Express</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Tracking Number</span>
          <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{trackingId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Estimated Delivery</span>
          <span className="font-bold text-slate-700">2-3 Business Days</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Keep Shopping
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="px-6 py-2.5 rounded-xl bg-[#1132d4] text-white text-sm font-bold shadow-[0_4px_16px_rgba(17,50,212,0.3)] hover:bg-[#0d28b8] transition-all flex items-center gap-2"
        >
          <span>Track Order (7 Stages)</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

// ─── BuyNowPage — exported, rendered inside ProductDetails ────────────────────
export default function BuyNowPage({ product, exchange, onBack }) {
  const [orderResult, setOrderResult] = useState(null);

  if (orderResult) return <SuccessScreen orderData={orderResult} />;

  return (
    <Elements stripe={stripePromise}>
      <BuyForm
        product={product}
        exchange={exchange}
        onBack={onBack}
        onSuccess={(data) => setOrderResult(data)}
      />
    </Elements>
  );
}
