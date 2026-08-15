"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { login as loginUser } from "@/services/auth.service";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      console.log("LOGIN API RESPONSE:", response);

      if (!response?.success) {
        throw new Error(response?.message || "Login failed");
      }

      // Save authentication data in browser
      localStorage.setItem("accessToken", response.data.accessToken);

      localStorage.setItem("refreshToken", response.data.refreshToken);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      console.log("Access Token:", localStorage.getItem("accessToken"));

      console.log("User:", localStorage.getItem("user"));

      toast.success("Login successful!");

      router.replace("/dashboard");
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Invalid email or password",
      );
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20 sm:p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-sky-500 text-2xl text-white shadow-lg shadow-blue-200">
          ✈️
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Welcome Back
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Sign in to your account and continue booking flights.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* EMAIL */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="john@example.com"
            {...register("email")}
            className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
              errors.email
                ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            }`}
          />

          {errors.email && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full rounded-xl border px-4 py-3 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                errors.password
                  ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-blue-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* REMEMBER */}
        <div className="flex items-center">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Remember me
          </label>
        </div>

        {/* LOGIN */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-sky-500 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        {/* DIVIDER */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-slate-400">OR</span>
          </div>
        </div>

        {/* REGISTER */}
        <div className="text-center text-sm text-slate-500">
          Don't have an account?
          <Link
            href="/register"
            className="ml-1.5 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Create Account
          </Link>
        </div>
      </form>

      <p className="mt-6 text-center text-xs leading-5 text-slate-400">
        Secure login for your flight booking account.
      </p>
    </div>
  );
}
