"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function HeroSection() {
  const { user, isLoading } = useAuth();

  return (
    <section className="relative overflow-hidden py-24">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/illustration-vah6H8-3VIU?w=1920&q=80&auto=format&fit=crop")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/40" />

      <div className="relative container mx-auto px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          发现你的下一部
          <span className="text-indigo-600">动漫</span>
        </h1>
        <p className="mx-auto mb-8 max-w-lg text-lg text-zinc-600">
          浏览丰富的动漫内容，轻松购买你喜爱的作品。
        </p>
        {!isLoading && !user && (
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/anime"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
            >
              浏览动漫
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              立即注册
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
