import axios from "axios";

const BASE_ORIGIN =
  import.meta.env.VITE_URL ||
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "") : null) ||
  (import.meta.env.VITE_API_URI ? import.meta.env.VITE_API_URI.replace(/\/api\/?$/, "") : null) ||
  window.location.origin;

const api = axios.create({
  baseURL: BASE_ORIGIN,
  withCredentials: true,
});

// REQUEST INTERCEPTOR — attach accessToken to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR — auto refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${BASE_ORIGIN}/api/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;
        localStorage.setItem("accessToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export async function register({ firebaseToken, firstname, lastname, email }) {
  const response = await api.post("/api/auth/register", {
    firebaseToken,
    firstname,
    lastname,
    email,
  });
  return response.data;
}

export async function login({ firebaseToken }) {
  const response = await api.post("/api/auth/login", { firebaseToken });
  return response.data;
}

/**
 * Send Demo OTP (1234) for email or mobile
 * @param {{ identifier: string, type: 'email' | 'mobile' }}
 */
export async function sendDemoOtp({ identifier, type }) {
  const response = await api.post("/api/auth/demo/send-otp", { identifier, type });
  return response.data;
}

/**
 * Verify Demo OTP (1234) and authenticate user
 * @param {{ identifier: string, type: 'email' | 'mobile', otp: string }}
 */
export async function verifyDemoOtp({ identifier, type, otp }) {
  const response = await api.post("/api/auth/demo/verify-otp", { identifier, type, otp });
  return response.data;
}

/**
 * Google Sign-In / Sign-Up
 * @param {string} credential - Google ID token from Google One Tap or OAuth popup
 */
export async function googleAuth(credential) {
  const response = await api.post("/api/auth/google", { credential });
  return response.data;
}

// Logout
export async function logout() {
  const response = await api.post("/api/auth/logout");
  return response.data;
}

// Get me
export async function getMe() {
  const response = await api.get("/api/auth/me");
  return response.data;
}