import api from "@/lib/axios";
import { LoginDto, RegisterDto } from "@/types/auth";

export const registerUser = async (data: RegisterDto) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginDto) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};