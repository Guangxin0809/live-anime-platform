"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  nickname: string | null;
  role: string;
  createdAt: string;
  _count: { orders: number };
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (roleFilter) params.set("role", roleFilter);
    if (keyword) params.set("keyword", keyword);

    fetch(`/api/admin/users?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setUsers(data.users);
          setPagination(data.pagination);
        }
      })
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, [page, roleFilter, keyword]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-800">用户管理</h1>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="搜索邮箱或昵称..."
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
          className="rounded-lg border px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
        />
        <div className="flex gap-2">
          {["", "USER", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => { setRoleFilter(r); setPage(1); }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                roleFilter === r
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {r || "全部"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg bg-white p-4 shadow-sm">
              <div className="mb-2 h-4 w-48 rounded bg-zinc-200" />
              <div className="h-3 w-32 rounded bg-zinc-200" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      ) : users.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center text-zinc-400">暂无用户</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-zinc-500">
                  <th className="px-4 py-3 font-medium">邮箱</th>
                  <th className="px-4 py-3 font-medium">昵称</th>
                  <th className="px-4 py-3 font-medium">角色</th>
                  <th className="px-4 py-3 font-medium">订单数</th>
                  <th className="px-4 py-3 font-medium">注册时间</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-zinc-50">
                    <td className="px-4 py-3 text-zinc-800">{user.email}</td>
                    <td className="px-4 py-3 text-zinc-600">{user.nickname || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-zinc-100 text-zinc-600"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{user._count.orders}</td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        详情
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="block rounded-lg bg-white p-4 shadow-sm"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-800">{user.nickname || user.email}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-zinc-100 text-zinc-600"
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="text-xs text-zinc-400">{user.email}</div>
                <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                  <span>{user._count.orders} 笔订单</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 hover:bg-white disabled:opacity-50"
              >
                上一页
              </button>
              <span className="text-sm text-zinc-500">{page} / {pagination.totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 hover:bg-white disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
