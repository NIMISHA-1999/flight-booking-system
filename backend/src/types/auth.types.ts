import { Request } from "express";

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthenticatedRequest
  extends Request {
  user?: {
    userId: string;
    email?: string;
    role?: "USER" | "ADMIN";
  };
}