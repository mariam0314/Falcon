import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import LazyImage from "../../components/LazyImage";
import { getDeviceImage, getDeviceFallback } from "../../utils/deviceImages";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/cart.context";
import { checkoutMultiple } from "../../services/shop.api";

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
  trash:
    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  arrow: "M10 19l-7-7m0 0l7-7m-7 7h18",
  bolt: "M13 10V3L4 14h7v7l9-11h-7z",
  shield:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  check: "M5 13l4 4L19 7",
  cart: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
  heart:
    "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
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
  { id: "Cash", label: "Cash", icon: "💵" },
];

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold
      ${type === "error" ? "bg-red-600 text-white" : "bg-slate-900 text-white"}`}
    >
      {msg}
    </div>
  );
}

// ─── Cart item row ────────────────────────────────────────────────────────────
function CartItem({ item, onRemove, onUpdateQty }) {
  const [removing, setRemoving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const { product, addedAt, quantity = 1 } = item;
  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await onRemove(product._id);
    } catch {
      setRemoving(false);
    }
  };

  const handleQtyChange = async (newQty) => {
    if (newQty < 1 || updating) return;
    setUpdating(true);
    try {
      await onUpdateQty(product._id, newQty);
    } finally {
      setUpdating(false);
    }
  };

  const itemSubtotal = (product.price || 0) * quantity;

  return (
    <div className="flex items-start gap-4 bg-white rounded-2xl border border-slate-100 p-4 hover:border-[#0077b6]/20 hover:shadow-[0_4px_16px_rgba(0,119,182,0.06)] transition-all duration-200">
      {/* Thumb */}
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-100 flex items-center justify-center flex-shrink-0 p-1.5 overflow-hidden cursor-pointer"
      >
        <LazyImage
          src={getDeviceImage(product)}
          alt={product.title}
          className="w-full h-full object-contain"
          fallback={getDeviceFallback(product.category)}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          {product.brand && (
            <span className="text-[10px] font-black text-[#0077b6] uppercase tracking-widest">
              {product.brand}
            </span>
          )}
          {product.condition && (
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
              {product.condition}
            </span>
          )}
        </div>
        <p
          className="text-sm font-bold text-slate-800 mt-1 leading-snug line-clamp-2 cursor-pointer hover:text-[#0077b6]"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          {product.title}
        </p>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-base font-extrabold text-slate-900">
            ₹{itemSubtotal.toLocaleString("en-IN")}
          </span>
          {quantity > 1 && (
            <span className="text-xs text-slate-400">
              (₹{product.price?.toLocaleString("en-IN")} × {quantity})
            </span>
          )}
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              ₹{(product.originalPrice * quantity).toLocaleString("en-IN")}
            </span>
          )}
          {discount > 0 && (
            <span className="text-xs font-bold text-emerald-600">
              {discount}% off
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-3">
          <div className="inline-flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <button
              type="button"
              onClick={() => handleQtyChange(quantity - 1)}
              disabled={quantity <= 1 || updating}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center text-xs font-black text-slate-800 select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQtyChange(quantity + 1)}
              disabled={updating}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 text-sm font-bold transition-colors"
              title="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="text-[11px] text-slate-400">
            Added {addedAt ? new Date(addedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "recently"}
          </span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={handleRemove}
        disabled={removing}
        className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0"
        title="Remove product"
      >
        {removing ? (
          <span className="w-4 h-4 border-2 border-slate-200 border-t-red-400 rounded-full animate-spin block" />
        ) : (
          <Ic d={I.trash} className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

// ─── Checkout form ───────────────────────────────────────────────────────────
function CheckoutForm({ items, total, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();

  const [method, setMethod] = useState("Card");
  const [name, setName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("SBI");
  const [processing, setProcessing] = useState(false);
  const [stripeErr, setStripeErr] = useState(null);

  const tax = Math.round(total * 0.18);
  const grand = total + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStripeErr(null);
    setProcessing(true);

    try {
      if (method === "Card") {
        if (!stripe || !elements) {
          setProcessing(false);
          return;
        }
        if (!name.trim()) {
          setStripeErr("Cardholder name is required");
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

      await checkoutMultiple(method);
      onSuccess();
    } catch (err) {
      onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment method tabs */}
      <div>
        <p className="text-sm font-bold text-slate-700 mb-3">Payment Method</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                method === m.id
                  ? "border-[#0077b6] bg-[#e8f4fd] text-[#0077b6]"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <span className="text-lg">{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs per method */}
      {method === "Card" && (
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Smith"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0077b6]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Card Number
            </label>
            <div className="bg-white border border-slate-200 rounded-xl p-2.5">
              <CardNumberElement options={STRIPE_STYLE} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Expiry Date
              </label>
              <div className="bg-white border border-slate-200 rounded-xl p-2.5">
                <CardExpiryElement options={STRIPE_STYLE} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                CVC / CVV
              </label>
              <div className="bg-white border border-slate-200 rounded-xl p-2.5">
                <CardCvcElement options={STRIPE_STYLE} />
              </div>
            </div>
          </div>
          {stripeErr && (
            <p className="text-red-500 text-xs mt-1 font-medium">{stripeErr}</p>
          )}
        </div>
      )}

      {method === "UPI" && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Virtual Payment Address (UPI ID)
          </label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="username@upi"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0077b6]"
          />
        </div>
      )}

      {method === "NetBanking" && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Select Your Bank
          </label>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0077b6]"
          >
            <option value="SBI">State Bank of India</option>
            <option value="HDFC">HDFC Bank</option>
            <option value="ICICI">ICICI Bank</option>
            <option value="Axis">Axis Bank</option>
          </select>
        </div>
      )}

      {method === "Cash" && (
        <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
          Cash on delivery — payment collected at doorstep handover.
        </p>
      )}

      {/* Summary */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">
            Subtotal ({items.reduce((s, i) => s + (i.quantity || 1), 0)} items)
          </span>
          <span className="font-semibold">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">GST (18%)</span>
          <span className="font-semibold">₹{tax.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Delivery</span>
          <span className="text-emerald-600 font-semibold">Free</span>
        </div>
        <div className="border-t border-slate-200 pt-2.5 flex justify-between">
          <span className="text-base font-extrabold text-slate-900">Total</span>
          <span className="text-xl font-extrabold text-[#0077b6]">
            ₹{grand.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2.5 text-xs text-slate-500 bg-[#e8f4fd] rounded-xl px-4 py-3">
        <Ic d={I.shield} className="w-4 h-4 text-[#0077b6] flex-shrink-0" />
        Demo secure checkout with FALCON protection guarantee.
      </div>

      <button
        type="submit"
        disabled={processing || (method === "Card" && !stripe)}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-[#0077b6] text-white font-extrabold text-sm shadow-[0_4px_20px_rgba(0,119,182,0.35)] hover:bg-[#005f8f] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {processing ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
            Processing…
          </>
        ) : (
          <>
            <Ic d={I.lock} className="w-4 h-4" /> Place Order — ₹
            {grand.toLocaleString("en-IN")}
          </>
        )}
      </button>
    </form>
  );
}

// ─── Main CartPage ────────────────────────────────────────────────────────────
export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, total, loading, removeItem, updateQuantity, clear } = useCart();

  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/cart");
    }
  }, [isAuthenticated, navigate]);

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId);
      showToast("Removed from cart");
    } catch {
      showToast("Failed to remove item", "error");
    }
  };

  const handleUpdateQty = async (productId, newQty) => {
    try {
      await updateQuantity(productId, newQty);
    } catch {
      showToast("Failed to update quantity", "error");
    }
  };

  const handleSuccess = () => {
    setSuccess(true);
    clear();
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success)
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5 p-8">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
          <Ic d={I.check} className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Order Placed Successfully!
        </h2>
        <p className="text-slate-500 text-sm text-center max-w-xs">
          Your order has been recorded. Thank you for using FALCON.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Browse Devices
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="px-5 py-2.5 rounded-xl bg-[#0077b6] text-white text-sm font-bold shadow-[0_4px_16px_rgba(0,119,182,0.3)] hover:bg-[#005f8f] transition-all"
          >
            View Orders
          </button>
        </div>
      </div>
    );

  return (
    <>
      <div className="cart-root min-h-screen bg-slate-50/50">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 px-4 md:px-8 py-4 flex items-center gap-4 sticky top-0 z-20">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-[#0077b6] hover:border-[#0077b6] transition-all"
          >
            <Ic d={I.arrow} />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">
              My Cart{" "}
              {!loading && items.length > 0 && (
                <span className="text-[#0077b6]">({items.reduce((s, i) => s + (i.quantity || 1), 0)})</span>
              )}
            </h1>
          </div>
          <button
            onClick={() => navigate("/wishlist")}
            className="ml-auto p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 transition-all"
            title="Wishlist"
          >
            <Ic d={I.heart} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-3 border-[#0077b6]/20 border-t-[#0077b6] rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center">
              <Ic d={I.cart} className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-700">
              Your cart is empty
            </h2>
            <p className="text-sm text-slate-400">
              Browse our catalog of genuine phones and laptops to add products.
            </p>
            <button
              onClick={() => navigate("/phones")}
              className="mt-2 bg-[#0077b6] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_16px_rgba(0,119,182,0.3)] hover:bg-[#005f8f] transition-all"
            >
              Browse Mobiles
            </button>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Items list */}
              <div className="lg:col-span-3 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {items.length} Product{items.length > 1 ? "s" : ""} in cart
                  </p>
                  <span className="text-xs font-bold text-[#0077b6]">
                    Total Quantity: {items.reduce((s, i) => s + (i.quantity || 1), 0)}
                  </span>
                </div>
                {items.map((item) => (
                  <CartItem
                    key={item.product?._id}
                    item={item}
                    onRemove={handleRemove}
                    onUpdateQty={handleUpdateQty}
                  />
                ))}
              </div>

              {/* Checkout panel */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_24px_rgba(0,119,182,0.06)] p-6 sticky top-20">
                  <h3 className="text-base font-extrabold text-slate-900 mb-5">
                    Order Summary &amp; Checkout
                  </h3>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      items={items}
                      total={total}
                      onSuccess={handleSuccess}
                      onError={(msg) => showToast(msg, "error")}
                    />
                  </Elements>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
