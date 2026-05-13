"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Anime {
  id: string;
  title: string;
  originalTitle: string | null;
  cover: string | null;
  status: string;
  totalEpisodes: number | null;
  releaseYear: number | null;
  createdAt: string;
  tags: { id: string; name: string }[];
  _count: { episodes: number; orderItems: number };
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function AdminAnimesPage() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAnimes = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (keyword) params.set("keyword", keyword);
    if (statusFilter) params.set("status", statusFilter);

    fetch(`/api/admin/animes?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setAnimes(data.animes);
          setPagination(data.pagination);
        }
      })
      .catch(() => setError("Failed to load animes"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAnimes(); }, [page, keyword, statusFilter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`确认删除《${title}》？此操作不可恢复。`)) return;

    const token = localStorage.getItem("token");
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/animes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else fetchAnimes();
    } catch {
      alert("删除失败");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-800">动漫管理</h1>
        <Link
          href="/admin/animes/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          创建动漫
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="搜索标题..."
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
          className="rounded-lg border px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
        />
        <div className="flex gap-2">
          {["", "ONGOING", "FINISHED", "UPCOMING"].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === s
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {s === "ONGOING" ? "连载中" : s === "FINISHED" ? "已完结" : s === "UPCOMING" ? "即将上映" : "全部"}
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
      ) : animes.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center text-zinc-400">暂无动漫</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-zinc-500">
                  <th className="px-4 py-3 font-medium">标题</th>
                  <th className="px-4 py-3 font-medium">标签</th>
                  <th className="px-4 py-3 font-medium">状态</th>
                  <th className="px-4 py-3 font-medium">剧集数</th>
                  <th className="px-4 py-3 font-medium">年份</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {animes.map((anime) => (
                  <tr key={anime.id} className="border-b last:border-0 hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-zinc-800">{anime.title}</div>
                      {anime.originalTitle && (
                        <div className="text-xs text-zinc-400">{anime.originalTitle}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {anime.tags.map((tag) => (
                          <span key={tag.id} className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        anime.status === "ONGOING" ? "bg-green-100 text-green-700" :
                        anime.status === "FINISHED" ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {anime.status === "ONGOING" ? "连载中" : anime.status === "FINISHED" ? "已完结" : "即将上映"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{anime._count.episodes}</td>
                    <td className="px-4 py-3 text-zinc-600">{anime.releaseYear || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/animes/${anime.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-700"
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => handleDelete(anime.id, anime.title)}
                          disabled={deletingId === anime.id}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          {deletingId === anime.id ? "删除中..." : "删除"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {animes.map((anime) => (
              <div key={anime.id} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-zinc-800">{anime.title}</div>
                    {anime.originalTitle && (
                      <div className="text-xs text-zinc-400">{anime.originalTitle}</div>
                    )}
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    anime.status === "ONGOING" ? "bg-green-100 text-green-700" :
                    anime.status === "FINISHED" ? "bg-blue-100 text-blue-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {anime.status === "ONGOING" ? "连载中" : anime.status === "FINISHED" ? "已完结" : "即将上映"}
                  </span>
                </div>
                <div className="mb-3 flex flex-wrap gap-1">
                  {anime.tags.map((tag) => (
                    <span key={tag.id} className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600">
                      {tag.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{anime._count.episodes} 集</span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/animes/${anime.id}/edit`}
                      className="text-xs text-indigo-600 hover:text-indigo-700"
                    >
                      编辑
                    </Link>
                    <button
                      onClick={() => handleDelete(anime.id, anime.title)}
                      disabled={deletingId === anime.id}
                      className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      {deletingId === anime.id ? "删除中..." : "删除"}
                    </button>
                  </div>
                </div>
              </div>
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
