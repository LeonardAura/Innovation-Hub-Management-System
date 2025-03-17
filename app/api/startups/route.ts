/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"
const startupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  logo: z.string().optional().or(z.literal("")),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  industry: z.string().min(1, { message: "Industry is required" }),
  foundedYear: z.number().min(1900, { message: "Please enter a valid year" }).max(new Date().getFullYear(), { message: "Year cannot be in the future" }),
  stage: z.string().min(1, { message: "Stage is required" }),
  teamSize: z.number().min(1).optional(),
  fundingRaised: z.number().min(0).optional(),
})
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * limit

    // Get startups with pagination and search
    const startups = await db.startup.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        user: {
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
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    })

    // Get total count for pagination
    const total = await db.startup.count({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      },
    })

    return NextResponse.json({
      startups,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Get startups error:", error)
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

    // Only startup role can create a startup profile
    if (user.role !== "STARTUP") {
      return NextResponse.json({ error: "Only users with startup role can create a startup profile" }, { status: 403 })
    }

    // Check if user already has a startup
    const existingStartup = await db.startup.findFirst({
      where: { userId: user.id },
    })

    if (existingStartup) {
      return NextResponse.json({ error: "You already have a startup profile" }, { status: 409 })
    }

    const body = await req.json()

    // Create startup
    const startup = await db.startup.create({
      data: {
        name: body.name,
        description: body.description,
        industry: body.industry,
        foundedYear: body.foundedYear,
        website: body.website,
        logo: body.logo,
        stage: body.stage,
        userId: user.id,
      },
    })

    return NextResponse.json(startup, { status: 201 })
  } catch (error) {
    console.error("Create startup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

