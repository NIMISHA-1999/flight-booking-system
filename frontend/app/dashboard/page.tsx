"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import HeroSearch from "@/components/dashboard/HeroSearch";
import QuickActions from "@/components/dashboard/QuickActions";
import PopularDestinations from "@/components/dashboard/PopularDestinations";
import DashboardCTA from "@/components/dashboard/DashboardCTA";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser: UserData =
        JSON.parse(storedUser);

      setUser(parsedUser);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      router.replace("/login");
    }
  }, [router]);

  return (
    <main className="bg-slate-50">

      <Navbar user={user} />

      <HeroSearch />

      <QuickActions />

      <PopularDestinations />

      <DashboardCTA />

      <Footer />

    </main>
  );
}