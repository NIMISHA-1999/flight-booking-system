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
  Lock,
  User,
  ArrowRight,
  Plane,
  ShieldCheck,
} from "lucide-react";

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
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await registerUser({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      console.log("REGISTRATION SUCCESS:", response);

      toast.success("Account created successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 700);
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
    <div className="w-full max-w-6xl">
      <div className="grid overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl shadow-black/40 backdrop-blur-2xl lg:grid-cols-2">

        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <div className="relative hidden min-h-[700px] flex-col justify-between overflow-hidden p-10 lg:flex">

          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200')",
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-blue-900/75 to-slate-950/90" />

          {/* Top */}
          <div className="relative z-10">

            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/30">
                <Plane
                  size={25}
                  className="-rotate-12 text-white"
                />
              </div>

              <span className="text-2xl font-bold text-white">
                Sky<span className="text-orange-400">Book</span>
              </span>
            </Link>

            <div className="mt-28 max-w-md">

              <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-orange-400">
                Start Your Journey
              </p>

              <h2 className="text-5xl font-bold leading-tight text-white">
                Travel farther.
                <br />
                Experience more.
              </h2>

              <p className="mt-6 text-lg leading-8 text-blue-100">
                Create your SkyBook account and discover
                flights, destinations and exclusive travel
                offers around the world.
              </p>

            </div>
          </div>

          {/* Benefits */}
          <div className="relative z-10 space-y-4">

            <Benefit
              icon={<ShieldCheck size={20} />}
              title="Secure Booking"
              text="Your account and payments are protected."
            />

            <Benefit
              icon={<Plane size={20} />}
              title="Worldwide Travel"
              text="Find flights to destinations around the globe."
            />

          </div>
        </div>

        {/* =====================================================
            RIGHT SIDE FORM
        ===================================================== */}

        <div className="bg-white px-6 py-8 sm:px-10 sm:py-12 lg:px-12">

          {/* Mobile Logo */}
          <div className="mb-8 flex justify-center lg:hidden">

            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-sky-500 text-white shadow-lg">
                <Plane
                  size={22}
                  className="-rotate-12"
                />
              </div>

              <span className="text-2xl font-bold text-slate-900">
                Sky<span className="text-orange-500">Book</span>
              </span>
            </Link>

          </div>

          {/* Header */}
          <div className="mb-8">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <User size={24} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Join SkyBook and start planning your next adventure.
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >

            {/* FIRST + LAST NAME */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <InputField
                id="firstName"
                label="First Name"
                placeholder="John"
                icon={<User size={18} />}
                error={errors.firstName?.message}
                registration={register("firstName")}
                autoComplete="given-name"
              />

              <InputField
                id="lastName"
                label="Last Name"
                placeholder="Doe"
                icon={<User size={18} />}
                error={errors.lastName?.message}
                registration={register("lastName")}
                autoComplete="family-name"
              />

            </div>

            {/* EMAIL */}
            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              icon={<Mail size={18} />}
              error={errors.email?.message}
              registration={register("email")}
              autoComplete="email"
            />

            {/* PASSWORD */}
            <PasswordField
              id="password"
              label="Password"
              placeholder="Enter your password"
              show={showPassword}
              onToggle={() =>
                setShowPassword((prev) => !prev)
              }
              error={errors.password?.message}
              registration={register("password")}
            />

            {!errors.password && (
              <p className="-mt-3 text-xs text-slate-400">
                Use at least 6 characters.
              </p>
            )}

            {/* CONFIRM PASSWORD */}
            <PasswordField
              id="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              show={showConfirmPassword}
              onToggle={() =>
                setShowConfirmPassword((prev) => !prev)
              }
              error={errors.confirmPassword?.message}
              registration={register("confirmPassword")}
            />

            {/* TERMS */}
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">

              <input
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <p className="text-xs leading-5 text-slate-500">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>

            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {isSubmitting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account

                  <ArrowRight
                    size={19}
                    className="transition-transform duration-300 group-hover:translate-x-1"
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
                <span className="bg-white px-3 text-xs text-slate-400">
                  ALREADY A MEMBER?
                </span>
              </div>

            </div>

            {/* LOGIN */}
            <div className="text-center text-sm text-slate-500">

              Already have an account?

              <Link
                href="/login"
                className="ml-1.5 font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
              >
                Sign in
              </Link>

            </div>

          </form>

          {/* Security */}
          <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-400">

            <ShieldCheck size={15} />

            <span>
              Your information is securely protected
            </span>

          </div>

        </div>
      </div>
    </div>
  );
}

/* =====================================================
   INPUT FIELD
===================================================== */

function InputField({
  id,
  label,
  placeholder,
  type = "text",
  icon,
  error,
  registration,
  autoComplete,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  icon: React.ReactNode;
  error?: string;
  registration: any;
  autoComplete?: string;
}) {
  return (
    <div>

      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="group relative">

        <div
          className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition ${
            error
              ? "text-red-500"
              : "text-slate-400 group-focus-within:text-blue-600"
          }`}
        >
          {icon}
        </div>

        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...registration}
          className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 ${
            error
              ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          }`}
        />

      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}

/* =====================================================
   PASSWORD FIELD
===================================================== */

function PasswordField({
  id,
  label,
  placeholder,
  show,
  onToggle,
  error,
  registration,
}: {
  id: string;
  label: string;
  placeholder: string;
  show: boolean;
  onToggle: () => void;
  error?: string;
  registration: any;
}) {
  return (
    <div>

      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="group relative">

        <Lock
          size={18}
          className={`absolute left-3 top-1/2 -translate-y-1/2 ${
            error
              ? "text-red-500"
              : "text-slate-400 group-focus-within:text-blue-600"
          }`}
        />

        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete="new-password"
          {...registration}
          className={`w-full rounded-xl border bg-slate-50 py-3 pl-10 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 ${
            error
              ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
          }`}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}

/* =====================================================
   BENEFIT
===================================================== */

function Benefit({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md transition duration-300 hover:bg-white/15">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-blue-100/80">
          {text}
        </p>
      </div>

    </div>
  );
}