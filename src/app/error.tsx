"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-zinc-300">500</h1>
        <h2 className="mb-2 text-xl font-semibold text-zinc-800">出错了</h2>
        <p className="mb-6 text-sm text-zinc-500">
          {error.message || "发生了意外错误，请稍后重试"}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            重试
          </button>
          <Link
            href="/"
            className="rounded-lg border px-5 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
