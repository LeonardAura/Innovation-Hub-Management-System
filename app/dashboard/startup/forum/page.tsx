import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MessageSquare, Plus, Search } from "lucide-react"

export default async function ForumPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Get forum posts
  const posts = await db.forumPost.findMany({
    include: {
      author: {
        select: {
          id: true,
          role: true,
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
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  })

  return (
    <DashboardLayout
      userRole={user.role}
      userName={user.profile?.name || "User"}
      userAvatar={user.profile?.avatar || undefined}
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Knowledge Hub</h1>

          <div className="flex gap-2 mt-4 md:mt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search posts..."
                className="pl-9 h-10 w-full md:w-64 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
              />
            </div>

            <a 
              href="/dashboard/startup/forum/create" 
              className="inline-flex items-center justify-center rounded-md bg-[#FF6B00] px-4 py-2 text-sm font-medium text-white hover:bg-[#e66000] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2 transition-colors"
            >
              <Plus size={16} className="mr-1" />
              New Post
            </a>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold cursor-pointer bg-transparent text-slate-900 border-slate-200">
            All Topics
          </span>
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold cursor-pointer bg-[#FF6B00] text-white border-transparent">
            Funding
          </span>
          <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold cursor-pointer bg-transparent text-slate-900 border-slate-200">
            Marketing
          </span>
          <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold cursor-pointer bg-transparent text-slate-900 border-slate-200">
            Product Development
          </span>
          <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold cursor-pointer bg-transparent text-slate-900 border-slate-200">
            Legal
          </span>
          <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold cursor-pointer bg-transparent text-slate-900 border-slate-200">
            Hiring
          </span>
          <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold cursor-pointer bg-transparent text-slate-900 border-slate-200">
            Growth
          </span>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              <a href={`/dashboard/startup/forum/${post.id}`} className="block hover:bg-slate-50">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="mt-1 text-slate-600 line-clamp-2">{post.content}</p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-transparent text-slate-900 border-slate-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                        {post.author.profile?.avatar ? (
                          <img 
                            src={post.author.profile.avatar} 
                            alt={post.author.profile?.name || "User"} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium">{(post.author.profile?.name || "U").charAt(0)}</span>
                        )}
                      </div>
                      <div className="ml-2">
                        <p className="text-sm font-medium">{post.author.profile?.name || "Anonymous"}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString()} • {post.author.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-slate-500">
                      <div className="flex items-center mr-4">
                        <MessageSquare size={14} className="mr-1" />
                        <span className="text-xs">{post._count.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}