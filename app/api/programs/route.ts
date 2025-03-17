import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"

// Validation schema for program
const programSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  maxParticipants: z.number().optional(),
  isActive: z.boolean().default(true),
  applicationQuestions: z
    .array(
      z.object({
        question: z.string(),
        required: z.boolean().default(true),
      }),
    )
    .optional(),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const isActive = searchParams.get("isActive")

    const skip = (page - 1) * limit

    const where: any = {}

    // Filter by active status if provided
    if (isActive !== null) {
      where.isActive = isActive === "true"
    }

    // Get programs with pagination
    const programs = await db.program.findMany({
      where,
      include: {
        applicationQuestions: true,
        _count: {
          select: {
            applications: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    })

    // Get total count for pagination
    const total = await db.program.count({ where })

    return NextResponse.json({
      programs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Get programs error:", error)
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

    // Only admins can create programs
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can create programs" }, { status: 403 })
    }

    const body = await req.json()

    // Validate request body
    const result = programSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten().fieldErrors }, { status: 400 })
    }

    // Create program
    const program = await db.program.create({
      data: {
        name: body.name,
        description: body.description,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        maxParticipants: body.maxParticipants,
        isActive: body.isActive,
        applicationQuestions: {
          createMany: {
            data:
              body.applicationQuestions?.map((q) => ({
                question: q.question,
                required: q.required,
              })) || [],
          },
        },
      },
      include: {
        applicationQuestions: true,
      },
    })

    return NextResponse.json(program, { status: 201 })
  } catch (error) {
    console.error("Create program error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

