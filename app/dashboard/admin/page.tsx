import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BarChart, FileText, Users, Briefcase, Award } from "lucide-react"
import { JSX, ReactNode } from "react"

// Define types for the application
type UserRole = "ADMIN" | "STARTUP" | "MENTOR" | "INVESTOR"

type Profile = {
  name?: string
  avatar?: string
}

type User = {
  id: string
  email: string
  role: UserRole
  profile?: Profile
  createdAt: Date
}

type Startup = {
  id: string
  name: string
}

type Program = {
  id: string
  name: string
}

type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED"

type Application = {
  id: string
  status: ApplicationStatus
  createdAt: Date
  startup: Startup
  program: Program
}

type BadgeVariant = UserRole | ApplicationStatus
type BadgeType = "user" | "application"

type StatsCardProps = {
  title: string
  value: number
  description?: string
  icon: ReactNode
}

// Custom StatsCard component with Tailwind only
function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="rounded-full bg-slate-100 p-2 text-slate-600">
          {icon}
        </div>
      </div>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold">{value}</p>
        {description && (
          <p className="ml-2 text-xs text-slate-500">{description}</p>
        )}
      </div>
    </div>
  )
}

export default async function AdminDashboardPage(): Promise<JSX.Element> {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "ADMIN") {
    redirect(`/dashboard/${user.role.toLowerCase()}`)
  }

  // Get dashboard stats
  const [totalUsers, totalStartups, totalMentors, totalInvestors, totalApplications, pendingApplications] =
    await Promise.all([
      db.user.count(),
      db.startup.count(),
      db.user.count({ where: { role: "MENTOR" } }),
      db.user.count({ where: { role: "INVESTOR" } }),
      db.application.count(),
      db.application.count({ where: { status: "PENDING" } }),
    ])

  // Get recent users
  const recentUsers = await db.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      profile: true,
    },
  }) as User[]

  // Get recent applications
  const recentApplications = await db.application.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      startup: true,
      program: true,
    },
  }) as Application[]

  // Badge variant style mapping
  const getBadgeStyles = (variant: BadgeVariant, type: BadgeType): string => {
    const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
    
    if (type === "user") {
      if (variant === "ADMIN") return `${baseStyles} bg-purple-100 text-purple-800`
      if (variant === "STARTUP") return `${baseStyles} bg-[#FF6B00] text-white`
      return `${baseStyles} bg-slate-100 text-slate-800 border border-slate-200`
    }
    
    if (type === "application") {
      if (variant === "APPROVED") return `${baseStyles} bg-green-100 text-green-800`
      if (variant === "REJECTED") return `${baseStyles} bg-red-100 text-red-800`
      return `${baseStyles} bg-yellow-100 text-yellow-800` // For PENDING/warning
    }
    
    return `${baseStyles} bg-slate-100 text-slate-800`
  }

  return (
    <DashboardLayout
      userRole={user.role}
      userName={user.profile?.name || "Admin"}
      userAvatar={user.profile?.avatar || undefined}
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>

          <div className="flex gap-2 mt-4 md:mt-0">
            <a 
              href="/dashboard/admin/programs/create"
              className="inline-flex items-center justify-center rounded-md bg-[#FF6B00] px-4 py-2 text-sm font-medium text-white hover:bg-[#e66000] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2 transition-colors"
            >
              Create Program
            </a>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Users" value={totalUsers} icon={<Users size={18} />} />
          <StatsCard title="Startups" value={totalStartups} icon={<Briefcase size={18} />} />
          <StatsCard title="Mentors & Investors" value={totalMentors + totalInvestors} icon={<Award size={18} />} />
          <StatsCard
            title="Pending Applications"
            value={pendingApplications}
            description={`${totalApplications} total applications`}
            icon={<FileText size={18} />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Users Card */}
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-semibold">Recent Users</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {recentUsers.map((user) => (
                  <li key={user.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                        {user.profile?.avatar ? (
                          <img 
                            src={user.profile.avatar} 
                            alt={user.profile?.name || user.email} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium">{(user.profile?.name || user.email).charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.profile?.name || "Unnamed"}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={getBadgeStyles(user.role, "user")}>
                      {user.role}
                    </span>
                  </li>
                ))}
              </ul>
              <a 
                href="/dashboard/admin/users"
                className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
              >
                View All Users
              </a>
            </div>
          </div>

          {/* Recent Applications Card */}
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-semibold">Recent Applications</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {recentApplications.map((application) => (
                  <li key={application.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{application.startup.name}</p>
                      <p className="text-xs text-slate-500">Applied to: {application.program.name}</p>
                    </div>
                    <span className={getBadgeStyles(application.status, "application")}>
                      {application.status}
                    </span>
                  </li>
                ))}
              </ul>
              <a 
                href="/dashboard/admin/applications"
                className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
              >
                View All Applications
              </a>
            </div>
          </div>
        </div>

        {/* User Growth Chart Card */}
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-lg font-semibold">User Growth</h3>
          </div>
          <div className="p-6">
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              <BarChart size={24} className="mr-2" />
              <span>User growth chart will be displayed here</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}