"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { register as registerUser } from "@/services/auth.service";

const schema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters"),

    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

 const onSubmit = async (data: FormData) => {
  try {
    const response = await registerUser({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });

    console.log("REGISTRATION SUCCESS:", response);

    toast.success("Account created successfully!");

    // Small delay so the toast can be displayed
    setTimeout(() => {
      router.push("/login");
    }, 500);

  } catch (error: any) {
    console.error("Registration error:", error);

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Registration failed. Please try again.";

    toast.error(message);
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
          Create Account
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Create your account and start booking flights easily.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* First Name / Last Name */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              First Name
            </label>

            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="John"
              {...register("firstName")}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                errors.firstName
                  ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              }`}
            />

            {errors.firstName && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Last Name
            </label>

            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Doe"
              {...register("lastName")}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                errors.lastName
                  ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              }`}
            />

            {errors.lastName && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
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

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 px-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.password ? (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.password.message}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-slate-400">
              Use at least 6 characters.
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Confirm Password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`w-full rounded-xl border px-4 py-3 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                errors.confirmPassword
                  ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 px-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-sky-500 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating Account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Login */}
        <div className="pt-2 text-center text-sm text-slate-500">
          Already have an account?

          <Link
            href="/login"
            className="ml-1.5 font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
          >
            Login
          </Link>
        </div>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-xs leading-5 text-slate-400">
        By creating an account, you agree to our terms and privacy policy.
      </p>
    </div>
  );
}