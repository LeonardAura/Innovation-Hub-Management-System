import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BarChart, Calendar, FileText, MessageSquare, Users } from "lucide-react"

export default async function StartupDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "STARTUP") {
    redirect(`/dashboard/${user.role.toLowerCase()}`)
  }

  // Get startup profile
  const startup = await db.startup.findUnique({
    where: { userId: user.id },
    include: {
      applications: true,
      milestones: true,
    },
  })

  // Get unread messages count
  const unreadMessages = await db.message.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  })

  // Get upcoming events/deadlines
  const upcomingDeadlines = await db.application.findMany({
    where: {
      startupId: startup?.id,
      status: "PENDING",
    },
    include: {
      program: true,
    },
    take: 3,
  })

  // Get recent forum posts
  const recentPosts = await db.forumPost.findMany({
    include: {
      author: {
        select: {
          id: true,
          profile: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  })

  // Get available mentors count
  const availableMentors = await db.user.count({
    where: {
      role: "MENTOR",
    },
  })

  return (
    <DashboardLayout
      userRole={user.role}
      userName={user.profile?.name || "User"}
      userAvatar={user.profile?.avatar || undefined}
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

          {!startup && (
            <a
              href="/dashboard/startup/profile/create"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              Complete Your Startup Profile
            </a>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Applications" value={startup?.applications.length || 0} icon={<FileText size={18} />} />
          <StatsCard title="Milestones" value={startup?.milestones.length || 0} icon={<Calendar size={18} />} />
          <StatsCard title="Unread Messages" value={unreadMessages} icon={<MessageSquare size={18} />} />
          <StatsCard title="Mentors Available" value={availableMentors} icon={<Users size={18} />} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Upcoming Deadlines Card */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold">Upcoming Deadlines</h3>
            </div>
            <div className="px-6 py-4">
              {upcomingDeadlines.length > 0 ? (
                <ul className="space-y-3">
                  {upcomingDeadlines.map((application) => (
                    <li key={application.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{application.program.name}</p>
                        <p className="text-sm text-slate-500">
                          {application.program.endDate
                            ? new Date(application.program.endDate).toLocaleDateString()
                            : "No deadline"}
                        </p>
                      </div>
                      <a
                        href={`/dashboard/startup/applications/${application.id}`}
                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        View
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">No upcoming deadlines</p>
              )}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-row items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <a
                href="/dashboard/startup/forum"
                className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                View All
              </a>
            </div>
            <div className="px-6 py-4">
              {recentPosts.length > 0 ? (
                <ul className="space-y-3">
                  {recentPosts.map((post) => (
                    <li key={post.id} className="border-b pb-2">
                      <a
                        href={`/dashboard/startup/forum/${post.id}`}
                        className="block hover:bg-slate-50 rounded-md -mx-2 p-2"
                      >
                        <p className="font-medium line-clamp-1">{post.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-slate-500">By {post.author.profile?.name || "Unknown"}</span>
                          <span className="text-xs text-slate-500">{post._count.comments} comments</span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Progress Overview Card */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold">Progress Overview</h3>
          </div>
          <div className="px-6 py-4">
            <div className="h-[200px] flex items-center justify-center text-slate-500">
              <BarChart size={24} className="mr-2" />
              <span>Progress chart will be displayed here</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Custom StatsCard component using only Tailwind CSS
function StatsCard({ title, value, icon }: { title: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h4 className="mt-2 text-3xl font-bold">{value}</h4>
        </div>
        <div className="rounded-full bg-blue-50 p-2 text-blue-600">{icon}</div>
      </div>
    </div>
  )
}

