import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"

// Validation schema for milestone
const milestoneSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  targetDate: z.string().optional(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "DELAYED"]),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const startupId = params.id

    // Get milestones for a startup
    const milestones = await db.milestone.findMany({
      where: { startupId },
      orderBy: { targetDate: "asc" },
    })

    return NextResponse.json(milestones)
  } catch (error) {
    console.error("Get milestones error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const startupId = params.id

    // Verify authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get startup
    const startup = await db.startup.findUnique({
      where: { id: startupId },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    // Check if user is the owner or an admin
    if (startup.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You don't have permission to add milestones to this startup" },
        { status: 403 },
      )
    }

    const body = await req.json()

    // Validate request body
    const result = milestoneSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten().fieldErrors }, { status: 400 })
    }

    // Create milestone
    const milestone = await db.milestone.create({
      data: {
        title: body.title,
        description: body.description,
        targetDate: body.targetDate ? new Date(body.targetDate) : undefined,
        status: body.status,
        startupId,
      },
    })

    return NextResponse.json(milestone, { status: 201 })
  } catch (error) {
    console.error("Create milestone error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

