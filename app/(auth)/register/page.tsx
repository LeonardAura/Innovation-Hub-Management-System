import { AuthForm } from "@/components/auth/auth-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#0F172A]">Startup Incubator</h1>
        <p className="mt-2 text-slate-500">Create an account to join our platform</p>
      </div>
      <AuthForm type="register" />
    </div>
  )
}

