"use client";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      {/* Content */}
      <div >
        <LoginForm />
      </div>
    </main>
  );
}