import api from "@/lib/axios";
import { LoginDto, RegisterDto } from "@/types/auth";

export const register = async (data: RegisterDto) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginDto) => {
  const res = await api.post("/auth/login", data);

  // Store tokens after login
  if (typeof window !== "undefined") {
    const accessToken = res.data?.data?.accessToken;
    const refreshToken = res.data?.data?.refreshToken;

    if (accessToken) {
      localStorage.setItem(
        "accessToken",
        accessToken,
      );
    }

    if (refreshToken) {
      localStorage.setItem(
        "refreshToken",
        refreshToken,
      );
    }
  }

  return res.data;
};

export const refreshAccessToken = async () => {
  if (typeof window === "undefined") {
    throw new Error("Authentication unavailable.");
  }

  const refreshToken =
    localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error(
      "Session expired. Please login again.",
    );
  }

  const res = await api.post(
    "/auth/refresh",
    {
      refreshToken,
    },
  );

  const accessToken =
    res.data?.data?.accessToken;

  if (!accessToken) {
    throw new Error(
      "Unable to refresh access token.",
    );
  }

  localStorage.setItem(
    "accessToken",
    accessToken,
  );

  // If your backend rotates refresh tokens
  const newRefreshToken =
    res.data?.data?.refreshToken;

  if (newRefreshToken) {
    localStorage.setItem(
      "refreshToken",
      newRefreshToken,
    );
  }

  return accessToken;
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }
};