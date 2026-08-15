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

interface RetryRequest
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/*
 * =====================================================
 * REQUEST INTERCEPTOR
 * =====================================================
 */

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }
    }

    return config;
  },
);

/*
 * =====================================================
 * REFRESH STATE
 * =====================================================
 */

let isRefreshing = false;

let refreshSubscribers: Array<
  (token: string) => void
> = [];

function subscribeTokenRefresh(
  callback: (token: string) => void,
) {
  refreshSubscribers.push(callback);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach(
    (callback) => callback(token),
  );

  refreshSubscribers = [];
}

/*
 * =====================================================
 * RESPONSE INTERCEPTOR
 * =====================================================
 */

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryRequest | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    /*
     * Only refresh on 401
     */
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    /*
     * Never refresh the refresh request itself
     */
    if (
      originalRequest.url?.includes(
        "/auth/refresh",
      )
    ) {
      return Promise.reject(error);
    }

    /*
     * Don't retry same request twice
     */
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /*
     * Another request is already refreshing
     */
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh(
          (newToken) => {
            originalRequest.headers.Authorization =
              `Bearer ${newToken}`;

            resolve(api(originalRequest));
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
          "Refresh token not found.",
        );
      }

      console.log(
        "ACCESS TOKEN EXPIRED → REFRESHING",
      );

      /*
       * IMPORTANT:
       * Use axios directly.
       * Don't use api here.
       */
      const refreshResponse =
        await axios.post(
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

      console.log(
        "REFRESH RESPONSE:",
        refreshResponse.data,
      );

      /*
       * Support either:
       *
       * {
       *   data: {
       *     accessToken: "..."
       *   }
       * }
       *
       * or:
       *
       * {
       *   accessToken: "..."
       * }
       */

      const newAccessToken =
        refreshResponse.data?.data
          ?.accessToken ||
        refreshResponse.data?.accessToken;

      const newRefreshToken =
        refreshResponse.data?.data
          ?.refreshToken ||
        refreshResponse.data?.refreshToken;

      if (!newAccessToken) {
        throw new Error(
          "Refresh API did not return accessToken.",
        );
      }

      /*
       * Save new access token
       */
      localStorage.setItem(
        "accessToken",
        newAccessToken,
      );

      /*
       * Save rotated refresh token
       * if backend returns one.
       */
      if (newRefreshToken) {
        localStorage.setItem(
          "refreshToken",
          newRefreshToken,
        );
      }

      console.log(
        "NEW ACCESS TOKEN SAVED",
      );

      /*
       * Release waiting requests
       */
      onRefreshed(newAccessToken);

      /*
       * Retry original request
       */
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      console.error(
        "TOKEN REFRESH FAILED:",
        refreshError,
      );

      refreshSubscribers = [];

      /*
       * Clear authentication
       */
      localStorage.removeItem(
        "accessToken",
      );

      localStorage.removeItem(
        "refreshToken",
      );

      localStorage.removeItem("user");

      return Promise.reject(
        refreshError,
      );
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;