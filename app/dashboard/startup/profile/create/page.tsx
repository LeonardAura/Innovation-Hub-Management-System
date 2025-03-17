"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

// Form schema based on the Prisma schema
const startupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  logo: z.string().optional().or(z.literal("")),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  industry: z.string().min(1, { message: "Industry is required" }),
  foundedYear: z.coerce
    .number()
    .min(1900, { message: "Please enter a valid year" })
    .max(new Date().getFullYear(), { message: "Year cannot be in the future" }),
  stage: z.string().min(1, { message: "Stage is required" }),
  teamSize: z.coerce.number().min(1).optional(),
  fundingRaised: z.coerce.number().min(0).optional(),
})

type StartupFormValues = z.infer<typeof startupSchema>

export default function CreateStartupProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StartupFormValues>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
      name: "",
      description: "",
      logo: "",
      website: "",
      industry: "",
      foundedYear: new Date().getFullYear(),
      stage: "",
      teamSize: 1,
      fundingRaised: 0,
    },
  })

  const onSubmit = async (data: StartupFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create startup profile")
      }

      router.push("/dashboard/startup")
    } catch (err) {
      console.error("Error creating startup profile:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const stageOptions = ["Idea", "Pre-seed", "Seed", "Series A", "Series B", "Series C+", "Growth", "Established"]

  const industryOptions = [
    "Fintech",
    "Healthtech",
    "Edtech",
    "E-commerce",
    "SaaS",
    "AI/ML",
    "Blockchain",
    "Clean Energy",
    "Consumer",
    "Enterprise",
    "Hardware",
    "Other",
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Your Startup Profile</h1>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Startup Information</h2>
            <p className="text-sm text-gray-600">Complete your startup profile to connect with mentors and investors</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Startup Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    {...register("description")}
                    className={`w-full min-h-[120px] rounded-md border shadow-sm p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                      Industry *
                    </label>
                    <select
                      id="industry"
                      {...register("industry")}
                      className={`w-full h-10 rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.industry ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Industry</option>
                      {industryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.industry && <p className="mt-1 text-xs text-red-500">{errors.industry.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
                      Stage *
                    </label>
                    <select
                      id="stage"
                      {...register("stage")}
                      className={`w-full h-10 rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.stage ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Stage</option>
                      {stageOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.stage && <p className="mt-1 text-xs text-red-500">{errors.stage.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="foundedYear" className="block text-sm font-medium text-gray-700 mb-1">
                      Founded Year *
                    </label>
                    <input
                      id="foundedYear"
                      type="number"
                      {...register("foundedYear")}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.foundedYear ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.foundedYear && <p className="mt-1 text-xs text-red-500">{errors.foundedYear.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      {...register("website")}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.website ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.website && <p className="mt-1 text-xs text-red-500">{errors.website.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-1">
                      Team Size
                    </label>
                    <input
                      id="teamSize"
                      type="number"
                      {...register("teamSize")}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.teamSize ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.teamSize && <p className="mt-1 text-xs text-red-500">{errors.teamSize.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="fundingRaised" className="block text-sm font-medium text-gray-700 mb-1">
                      Funding Raised (USD)
                    </label>
                    <input
                      id="fundingRaised"
                      type="number"
                      {...register("fundingRaised")}
                      min="0"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        errors.fundingRaised ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.fundingRaised && <p className="mt-1 text-xs text-red-500">{errors.fundingRaised.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    id="logo"
                    type="text"
                    placeholder="https://example.com/logo.png"
                    {...register("logo")}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.logo ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter a URL to your logo image (optional)</p>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/startup")}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="inline-block mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}