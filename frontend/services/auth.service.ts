import api from "@/lib/axios";
import { LoginDto, RegisterDto } from "@/types/auth";

export const register = async (data: RegisterDto) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginDto) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};