import axios from "axios";
import { API_BASE_URL } from "./api.config";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ─── Attach auth token & normalize URL to avoid duplicate /api ─────────────
API.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith("/api/")) {
    config.url = config.url.slice(4);
  }
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── GET /subscriptions/plans — public ─────────────────────────────────────
export const getPlans = async () => {
  const { data } = await API.get("/subscriptions/plans");
  return data; // { success, plans[] }
};

// ─── POST /subscriptions — user subscribes & auto-becomes seller ────────────
// payload: { plan, paymentMethod, paymentId }
export const subscribe = async (payload) => {
  const { data } = await API.post("/subscriptions", payload);
  return data; // { success, message, data: subscription }
};

// ─── GET /subscriptions/my — seller's active subscription ──────────────────
export const getMySubscription = async () => {
  const { data } = await API.get("/subscriptions/my");
  return data; // { success, data: { ...subscription, isExpired, daysRemaining } }
};

// ─── PUT /subscriptions/upgrade — seller upgrades plan ─────────────────────
// payload: { plan, paymentMethod, paymentId }
export const upgradePlan = async (payload) => {
  const { data } = await API.put("/subscriptions/upgrade", payload);
  return data; // { success, message, data: subscription }
};