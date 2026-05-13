import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-zinc-900">登录</h1>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-zinc-500">
          还没有账号？
          <Link href="/auth/register" className="text-indigo-600 hover:underline">
            立即注册
          </Link>
        </p>
      </div>
    </div>
  );
}
