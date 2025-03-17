import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    // Verify authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can access stats
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get counts for dashboard stats
    const [
      totalUsers,
      totalStartups,
      totalMentors,
      totalInvestors,
      totalApplications,
      pendingApplications,
      totalPosts,
      totalComments,
    ] = await Promise.all([
      db.user.count(),
      db.startup.count(),
      db.mentorProfile.count(),
      db.investorProfile.count(),
      db.application.count(),
      db.application.count({ where: { status: "PENDING" } }),
      db.forumPost.count(),
      db.forumComment.count(),
    ])

    // Get recent users
    const recentUsers = await db.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        profile: true,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    })

    // Get recent applications
    const recentApplications = await db.application.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        startup: true,
        program: true,
      },
    })

    // Get user role distribution
    const userRoles = await db.user.groupBy({
      by: ["role"],
      _count: true,
    })

    // Get application status distribution
    const applicationStatus = await db.application.groupBy({
      by: ["status"],
      _count: true,
    })

    return NextResponse.json({
      counts: {
        totalUsers,
        totalStartups,
        totalMentors,
        totalInvestors,
        totalApplications,
        pendingApplications,
        totalPosts,
        totalComments,
      },
      recentUsers,
      recentApplications,
      userRoles,
      applicationStatus,
    })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

