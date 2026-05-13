"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";

interface Tag {
  id: string;
  name: string;
}

interface AnimeData {
  id: string;
  title: string;
  originalTitle: string | null;
  cover: string | null;
  description: string | null;
  releaseYear: number | null;
  region: string | null;
  status: string;
  totalEpisodes: number | null;
  tags: Tag[];
}

export default function EditAnimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    originalTitle: "",
    cover: "",
    description: "",
    releaseYear: "",
    region: "",
    status: "ONGOING",
    totalEpisodes: "",
    selectedTags: [] as string[],
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/anime/tags").then((r) => r.json()),
      fetch(`/api/anime/${id}`).then((r) => r.json()),
    ])
      .then(([tagsData, animeData]) => {
        setAllTags(tagsData.tags || []);
        if (animeData.error) {
          setError(animeData.error);
          return;
        }
        const a: AnimeData = animeData.anime || animeData;
        setForm({
          title: a.title || "",
          originalTitle: a.originalTitle || "",
          cover: a.cover || "",
          description: a.description || "",
          releaseYear: a.releaseYear ? String(a.releaseYear) : "",
          region: a.region || "",
          status: a.status || "ONGOING",
          totalEpisodes: a.totalEpisodes ? String(a.totalEpisodes) : "",
          selectedTags: (a.tags || []).map((t: Tag) => t.id),
        });
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleTag = (tagId: string) => {
    setForm((f) => ({
      ...f,
      selectedTags: f.selectedTags.includes(tagId)
        ? f.selectedTags.filter((tid) => tid !== tagId)
        : [...f.selectedTags, tagId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("标题不能为空");
      return;
    }

    const token = localStorage.getItem("token");
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/animes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          originalTitle: form.originalTitle || undefined,
          cover: form.cover || undefined,
          description: form.description || undefined,
          releaseYear: form.releaseYear || undefined,
          region: form.region || undefined,
          status: form.status,
          totalEpisodes: form.totalEpisodes || undefined,
          tags: form.selectedTags,
        }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else router.push("/admin/animes");
    } catch {
      setError("更新失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/animes" className="text-sm text-indigo-600 hover:text-indigo-700">
          &larr; 返回
        </Link>
        <h1 className="text-2xl font-bold text-zinc-800">编辑动漫</h1>
      </div>

      {loading ? (
        <div className="h-96 animate-pulse rounded-xl bg-white shadow-sm" />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-zinc-700">标题 *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">原标题</label>
              <input
                type="text"
                value={form.originalTitle}
                onChange={(e) => setForm({ ...form, originalTitle: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">封面 URL</label>
              <input
                type="text"
                value={form.cover}
                onChange={(e) => setForm({ ...form, cover: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-zinc-700">描述</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">发行年份</label>
              <input
                type="number"
                value={form.releaseYear}
                onChange={(e) => setForm({ ...form, releaseYear: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">地区</label>
              <input
                type="text"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">状态</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500"
              >
                <option value="ONGOING">连载中</option>
                <option value="FINISHED">已完结</option>
                <option value="UPCOMING">即将上映</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">总集数</label>
              <input
                type="number"
                value={form.totalEpisodes}
                onChange={(e) => setForm({ ...form, totalEpisodes: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">标签</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    form.selectedTags.includes(tag.id)
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? "保存中..." : "保存"}
            </button>
            <Link href="/admin/animes" className="text-sm text-zinc-600 hover:text-zinc-800">
              取消
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
