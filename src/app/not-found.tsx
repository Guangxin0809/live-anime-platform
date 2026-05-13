import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-zinc-300">404</h1>
        <h2 className="mb-2 text-xl font-semibold text-zinc-800">页面未找到</h2>
        <p className="mb-6 text-sm text-zinc-500">您访问的页面不存在或已被移除</p>
        <Link
          href="/"
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
