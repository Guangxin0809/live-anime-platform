import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-zinc-900">注册</h1>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-zinc-500">
          已有账号？
          <Link href="/auth/login" className="text-indigo-600 hover:underline">
            立即登录
          </Link>
        </p>
      </div>
    </div>
  );
}
