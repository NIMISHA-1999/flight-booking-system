"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  Plane,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

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

      localStorage.setItem("accessToken", response.data.accessToken);

      localStorage.setItem("refreshToken", response.data.refreshToken);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login successful!");

      const redirectAfterLogin = localStorage.getItem("redirectAfterLogin");

      if (redirectAfterLogin) {
        localStorage.removeItem("redirectAfterLogin");

        router.replace(redirectAfterLogin);
      } else {
        router.replace("/dashboard");
      }
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
    <main
      className="relative min-h-screen overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800')",
      }}
    >
      {/* BACKGROUND OVERLAY */}

      <div className="absolute inset-0 bg-slate-950/70" />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-slate-950/60 to-sky-900/50" />

      {/* CONTENT */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
          {/* ================= LEFT CONTENT ================= */}

          <div className="hidden text-white lg:block">
            {/* LOGO */}

            <Link href="/" className="mb-10 inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/30">
                <Plane size={25} className="-rotate-12" />
              </div>

              <span className="text-3xl font-bold tracking-tight">SkyBook</span>
            </Link>

            {/* HEADING */}

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
              Your Journey Starts Here
            </p>

            <h1 className="max-w-xl text-5xl font-bold leading-tight xl:text-6xl">
              Fly further.
              <br />
              <span className="text-sky-400">Dream bigger.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
              Sign in to manage your bookings, discover exclusive flight deals,
              and continue your journey with SkyBook.
            </p>

            {/* FEATURES */}

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                  <ShieldCheck size={22} className="text-orange-400" />
                </div>

                <div>
                  <p className="font-semibold">Secure & Protected</p>

                  <p className="text-sm text-slate-400">
                    Your account and bookings are protected.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                  <Plane size={22} className="text-sky-400" />
                </div>

                <div>
                  <p className="font-semibold">Worldwide Flights</p>

                  <p className="text-sm text-slate-400">
                    Explore destinations around the world.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= LOGIN CARD ================= */}

          <div className="w-full max-w-md justify-self-center lg:justify-self-end">
            {/* MOBILE LOGO */}

            <Link
              href="/"
              className="mb-6 flex items-center justify-center gap-2 text-white lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
                <Plane size={21} className="-rotate-12" />
              </div>

              <span className="text-2xl font-bold">SkyBook</span>
            </Link>

            <div className="rounded-[2rem] border border-white/20 bg-white/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
              {/* CARD HEADER */}

              <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-sky-500 text-white shadow-lg shadow-blue-200">
                  <Plane size={23} className="-rotate-12" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in to continue your journey with SkyBook.
                </p>
              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-5"
              >
                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        errors.email ? "text-red-400" : "text-slate-400"
                      }`}
                    />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      className={`h-12 w-full rounded-xl border bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
                        errors.email
                          ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      }`}
                    />
                  </div>

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
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-blue-600 transition hover:text-orange-500"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        errors.password ? "text-red-400" : "text-slate-400"
                      }`}
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      {...register("password")}
                      className={`h-12 w-full rounded-xl border bg-slate-50 pl-11 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
                        errors.password
                          ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      }`}
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600"
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* REMEMBER */}

                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Remember me
                  </label>
                </div>

                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-sky-500 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-800 hover:to-sky-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

                {/* DIVIDER */}

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>

                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-xs font-medium text-slate-400">
                      OR
                    </span>
                  </div>
                </div>

                {/* REGISTER */}

                <div className="rounded-xl bg-slate-50 p-4 text-center">
                  <p className="text-sm text-slate-500">
                    Don't have an account?
                  </p>

                  <Link
                    href="/register"
                    className="mt-1 inline-block text-sm font-bold text-blue-600 transition hover:text-orange-500"
                  >
                    Create your account →
                  </Link>
                </div>
              </form>

              {/* SECURITY */}

              <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">
                <ShieldCheck size={14} />
                Secure and encrypted login
              </div>
            </div>

            {/* BACK HOME */}

            <div className="mt-5 text-center">
              <Link
                href="/"
                className="text-sm font-medium text-white/80 transition hover:text-white"
              >
                ← Back to SkyBook
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
