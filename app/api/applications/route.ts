import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"

// Validation schema for application
const applicationSchema = z.object({
  programId: z.string(),
  startupId: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    }),
  ),
})

export async function GET(req: Request) {
  try {
    // Verify authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")

    const skip = (page - 1) * limit

    const where: any = {}

    // Filter by status if provided
    if (status) {
      where.status = status
    }

    // If user is a startup, only show their applications
    if (user.role === "STARTUP") {
      const startup = await db.startup.findFirst({
        where: { userId: user.id },
      })

      if (!startup) {
        return NextResponse.json({ error: "Startup profile not found" }, { status: 404 })
      }

      where.startupId = startup.id
    }

    // If user is an admin or mentor, show all applications

    // Get applications with pagination
    const applications = await db.application.findMany({
      where,
      include: {
        startup: true,
        program: true,
        reviews: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    })

    // Get total count for pagination
    const total = await db.application.count({ where })

    return NextResponse.json({
      applications,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Get applications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    // Verify authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only startup role can submit applications
    if (user.role !== "STARTUP") {
      return NextResponse.json({ error: "Only startups can submit applications" }, { status: 403 })
    }

    const body = await req.json()

    // Validate request body
    const result = applicationSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten().fieldErrors }, { status: 400 })
    }

    // Check if startup exists and belongs to user
    const startup = await db.startup.findFirst({
      where: {
        id: body.startupId,
        userId: user.id,
      },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found or you don't have permission" }, { status: 404 })
    }

    // Check if program exists
    const program = await db.program.findUnique({
      where: { id: body.programId },
    })

    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 })
    }

    // Check if application already exists
    const existingApplication = await db.application.findFirst({
      where: {
        startupId: body.startupId,
        programId: body.programId,
      },
    })

    if (existingApplication) {
      return NextResponse.json({ error: "You have already applied to this program" }, { status: 409 })
    }

    // Create application
    const application = await db.application.create({
      data: {
        startupId: body.startupId,
        programId: body.programId,
        status: "PENDING",
        answers: {
          createMany: {
            data: body.answers.map((answer) => ({
              questionId: answer.questionId,
              answer: answer.answer,
            })),
          },
        },
      },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error("Create application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

