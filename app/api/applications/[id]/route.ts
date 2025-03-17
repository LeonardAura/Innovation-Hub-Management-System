import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Verify authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get application by ID
    const application = await db.application.findUnique({
      where: { id },
      include: {
        startup: true,
        program: true,
        answers: {
          include: {
            question: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                email: true,
                role: true,
                profile: {
                  select: {
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Check if user has permission to view this application
    if (
      user.role !== "ADMIN" &&
      user.role !== "MENTOR" &&
      !(user.role === "STARTUP" && application.startup.userId === user.id)
    ) {
      return NextResponse.json({ error: "You don't have permission to view this application" }, { status: 403 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("Get application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Verify authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can update application status
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can update application status" }, { status: 403 })
    }

    const body = await req.json()

    // Update application status
    const updatedApplication = await db.application.update({
      where: { id },
      data: {
        status: body.status,
        feedbackNote: body.feedbackNote,
      },
    })

    return NextResponse.json(updatedApplication)
  } catch (error) {
    console.error("Update application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

