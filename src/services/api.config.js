// ─── api.config.js ────────────────────────────────────────────────────────────
// Centralized API URL and environment configuration for FALCON frontend.
// Automatically sanitizes accidental literal prefixes, trims slashes,
// and guarantees consistent API endpoints without duplicate "/api".

/**
 * Strips accidental environment variable prefix literals, surrounding quotes,
 * and trailing slashes.
 * Handles cases like:
 *   "VITE_API_URL=https://falcon-backend-1hnp.onrender.com/api" -> "https://falcon-backend-1hnp.onrender.com/api"
 *   "https://falcon-backend-1hnp.onrender.com/api/"            -> "https://falcon-backend-1hnp.onrender.com/api"
 *   "\"https://falcon-backend-1hnp.onrender.com\""            -> "https://falcon-backend-1hnp.onrender.com"
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== "string") return "";
  let clean = url.trim();

  // Strip any accidental leading "KEY=" prefix (e.g. from copy-pasting the full line into hosting provider env)
  while (/^(?:VITE_API_URL|VITE_API_URI|VITE_URL|VITE_BACKEND_URL|API_URL)\s*=\s*/i.test(clean)) {
    clean = clean.replace(/^(?:VITE_API_URL|VITE_API_URI|VITE_URL|VITE_BACKEND_URL|API_URL)\s*=\s*/i, "").trim();
  }

  // Strip enclosing quotes if any
  clean = clean.replace(/^["'](.*)["']$/, "$1").trim();

  // Strip trailing slashes
  clean = clean.replace(/\/+$/, "");

  return clean;
}

/**
 * Retrieves the raw configured API URL from Vite environment variables.
 */
function getRawEnvApiUrl() {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    return (
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_API_URI ||
      import.meta.env.VITE_URL ||
      import.meta.env.VITE_BACKEND_URL ||
      ""
    );
  }
  return "";
}

/**
 * Returns the backend root origin without /api and without trailing slash.
 * E.g. "https://falcon-backend-1hnp.onrender.com" or "http://localhost:3000"
 */
export function getApiOrigin() {
  const sanitized = sanitizeUrl(getRawEnvApiUrl());
  if (sanitized && /^https?:\/\//i.test(sanitized)) {
    return sanitized.replace(/\/api\/?$/i, "");
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
}

/**
 * Returns the base API URL (always ends with /api, no trailing slash).
 * E.g. "https://falcon-backend-1hnp.onrender.com/api" or "http://localhost:3000/api" or "/api"
 */
export function getApiBaseUrl() {
  const sanitized = sanitizeUrl(getRawEnvApiUrl());
  if (!sanitized) {
    return "/api";
  }
  if (/^https?:\/\//i.test(sanitized)) {
    return sanitized.replace(/\/api\/?$/i, "") + "/api";
  }
  const normalized = sanitized.startsWith("/") ? sanitized : `/${sanitized}`;
  return normalized.replace(/\/api\/?$/i, "") + "/api";
}

/**
 * Builds a clean, fully-qualified API URL for an endpoint.
 * Ensures:
 * - Accidental literal prefixes in endpoint strings are removed
 * - Leading slashes are handled
 * - /api is NOT duplicated if endpoint already contains /api or /api/
 * - /products correctly maps to `${API_BASE_URL}/products`
 */
export function buildApiUrl(endpoint = "") {
  const base = getApiBaseUrl();
  if (!endpoint) return base;

  let path = typeof endpoint === "string" ? endpoint.trim() : String(endpoint);

  while (/^(?:VITE_API_URL|VITE_API_URI|VITE_URL|VITE_BACKEND_URL|API_URL)\s*=\s*/i.test(path)) {
    path = path.replace(/^(?:VITE_API_URL|VITE_API_URI|VITE_URL|VITE_BACKEND_URL|API_URL)\s*=\s*/i, "").trim();
  }
  path = path.replace(/^["'](.*)["']$/, "$1").trim();

  // If path is already an absolute HTTP/HTTPS URL, return it sanitized
  if (/^https?:\/\//i.test(path)) {
    return path.replace(/\/+$/, "");
  }

  let normalized = path.startsWith("/") ? path : `/${path}`;

  // Prevent duplicating /api
  if (normalized === "/api") {
    return base;
  }
  if (normalized.startsWith("/api/")) {
    normalized = normalized.slice(4); // leaves '/...'
  }

  return `${base}${normalized}`;
}

/**
 * Returns the WebSocket server URL.
 */
export function getSocketUrl() {
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_SOCKET_URL) {
    const sanitized = sanitizeUrl(import.meta.env.VITE_SOCKET_URL);
    if (sanitized) return sanitized;
  }
  return getApiOrigin() || (typeof window !== "undefined" ? window.location.origin : "");
}

export const API_BASE_URL = getApiBaseUrl();
export const API_ORIGIN   = getApiOrigin();
export const BASE_URL     = API_BASE_URL;
export const SOCKET_URL   = getSocketUrl();
