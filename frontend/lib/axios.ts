// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// });

// export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL:
//     process.env.NEXT_PUBLIC_API_URL ||
//     "http://localhost:4000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("accessToken");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }

//   return config;
// });

// export default api;

import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * =====================================================
 * REQUEST INTERCEPTOR
 * =====================================================
 */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");

      console.log("========== AXIOS REQUEST ==========");
      console.log("URL:", config.url);
      console.log("ACCESS TOKEN EXISTS:", !!token);
      console.log(
        "ACCESS TOKEN:",
        token ? `${token.substring(0, 20)}...` : null,
      );

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(
        "AUTH HEADER:",
        config.headers.Authorization,
      );
    }

    return config;
  },
);

/*
 * =====================================================
 * RESPONSE INTERCEPTOR
 * =====================================================
 */

let isRefreshing = false;

let refreshSubscribers: ((
  token: string,
) => void)[] = [];

const subscribeTokenRefresh = (
  callback: (token: string) => void,
) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(
    (callback) => callback(token),
  );

  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

    /*
     * Only handle 401
     */
    if (
      error.response?.status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    /*
     * Don't refresh the refresh request itself
     */
    if (
      originalRequest.url?.includes(
        "/auth/refresh",
      )
    ) {
      return Promise.reject(error);
    }

    /*
     * Prevent infinite retry
     */
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      /*
       * Another request is already refreshing
       */
      return new Promise((resolve) => {
        subscribeTokenRefresh(
          (newToken) => {
            originalRequest.headers.Authorization =
              `Bearer ${newToken}`;

            resolve(
              api(originalRequest),
            );
          },
        );
      });
    }

    isRefreshing = true;

    try {
      const refreshToken =
        localStorage.getItem(
          "refreshToken",
        );

      if (!refreshToken) {
        throw new Error(
          "No refresh token available",
        );
      }

      /*
       * IMPORTANT:
       * Use axios directly here instead of `api`
       * so the interceptor does not intercept itself.
       */
      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        {
          refreshToken,
        },
        {
          headers: {
            "Content-Type":
              "application/json",
          },
        },
      );

      const newAccessToken =
        response.data?.data?.accessToken;

      if (!newAccessToken) {
        throw new Error(
          "No access token returned",
        );
      }

      localStorage.setItem(
        "accessToken",
        newAccessToken,
      );

      /*
       * If backend rotates refresh token
       */
      const newRefreshToken =
        response.data?.data?.refreshToken;

      if (newRefreshToken) {
        localStorage.setItem(
          "refreshToken",
          newRefreshToken,
        );
      }

      /*
       * Notify queued requests
       */
      onRefreshed(newAccessToken);

      /*
       * Retry original request
       */
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      refreshSubscribers = [];

      localStorage.removeItem(
        "accessToken",
      );

      localStorage.removeItem(
        "refreshToken",
      );

      return Promise.reject(
        refreshError,
      );
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;