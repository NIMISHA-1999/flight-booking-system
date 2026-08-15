"use client";

import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-slate-950 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/75" />

      {/* Blue gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-slate-950/60 to-sky-950/70" />

      {/* Decorative glow */}
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <RegisterForm />
      </div>
    </main>
  );
}