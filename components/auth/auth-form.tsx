"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldErrors, useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"

// Form schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["STARTUP", "MENTOR", "INVESTOR","ADMIN"], {
    required_error: "Please select a role",
  }),
})

type LoginFormValues = z.infer<typeof loginSchema>
type RegisterFormValues = z.infer<typeof registerSchema>

interface AuthFormProps {
  type: "login" | "register"
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const isLogin = type === "login"
  const schema = isLogin ? loginSchema : registerSchema

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: isLogin ? { email: "", password: "" } : { name: "", email: "", password: "", role: "STARTUP" },
  })

  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong")
      }

      // Redirect based on user role
      if (isLogin) {
        const { user } = result
        console.log("User from login:", user);
        
        switch (user.role) {
          case "STARTUP":
            router.push("/dashboard/startup")
            break
          case "MENTOR":
          case "INVESTOR":
            router.push("/dashboard/advisor")
            break
          case "ADMIN":
            router.push("/dashboard/admin")
            break
          default:
            router.push("/dashboard")
        }
      } else {
        // After registration, redirect to login
        router.push("/login?registered=true")
      }
    } catch (err) {
      console.error("Auth error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="space-y-1.5 mb-5">
          <h3 className="text-2xl font-semibold text-gray-900">{isLogin ? "Login" : "Create an Account"}</h3>
          <p className="text-sm text-gray-500">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Fill in the details below to create your account"}
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 block">
                Name
              </label>
              <input
                id="name"
                placeholder="Enter your name"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                {...register("name")}
              />
              {"name" in errors && <p className="text-xs text-red-500 mt-1">{errors.name?.message as string}</p>}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message as string}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message as string}</p>}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-700 block">
                I am a
              </label>
              <select
                id="role"
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
                {...register("role")}
              >
                <option value="STARTUP">Startup Founder</option>
                <option value="MENTOR">Mentor</option>
                <option value="INVESTOR">Investor</option>
                <option value="ADMIN">Admin</option>
              </select>
              {"role" in errors && <p className="text-xs text-red-500 mt-1">{(errors as FieldErrors<RegisterFormValues>).role?.message as string}</p>}
            </div>
          )}

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-10 px-4 mt-6 rounded-md font-medium flex items-center justify-center ${
              isLoading
                ? "bg-[#FF6B00]/70 text-white cursor-not-allowed"
                : "bg-[#FF6B00] text-white hover:bg-[#FF6B00]/90"
            } transition-colors`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                {isLogin ? "Logging in..." : "Creating account..."}
              </>
            ) : (
              <>{isLogin ? "Login" : "Create account"}</>
            )}
          </button>
        </form>
      </div>
      <div className="py-4 px-6 border-t border-gray-200 bg-gray-50 flex justify-center">
        <p className="text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <a href={isLogin ? "/register" : "/login"} className="text-[#FF6B00] hover:underline">
            {isLogin ? "Sign up" : "Login"}
          </a>
        </p>
      </div>
    </div>
  )
}