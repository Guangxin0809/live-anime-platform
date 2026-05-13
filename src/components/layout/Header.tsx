"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

export function Header() {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/anime", label: "浏览动漫" },
    { href: "/anime/search", label: "搜索" },
    ...(user ? [{ href: "/order", label: "我的订单" }] : []),
    ...(user?.role === "ADMIN" ? [{ href: "/admin", label: "管理后台" }] : []),
  ];

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-zinc-900" onClick={() => setMenuOpen(false)}>
            Anime<span className="text-indigo-600">Hub</span>
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith(link.href)
                    ? "text-indigo-600"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <span className="text-sm text-zinc-400">加载中...</span>
          ) : user ? (
            <>
              <Link
                href="/auth/me"
                className="hidden text-sm text-zinc-600 hover:text-zinc-900 sm:block"
              >
                {user.nickname || user.email}
              </Link>
              <button
                onClick={logout}
                className="hidden text-sm font-medium text-zinc-500 hover:text-zinc-900 sm:block"
              >
                退出
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded p-1 hover:bg-zinc-100 sm:hidden"
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                登录
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t px-4 py-4 sm:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium ${
                  pathname.startsWith(link.href)
                    ? "text-indigo-600"
                    : "text-zinc-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  href="/auth/me"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-zinc-600"
                >
                  {user.nickname || user.email}
                </Link>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="text-left text-sm font-medium text-zinc-500"
                >
                  退出
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
