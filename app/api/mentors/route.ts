/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const expertise = searchParams.get("expertise")

    const skip = (page - 1) * limit

    const where: any = {
      user: {
        role: "MENTOR",
      },
    }

    // Add search filter
    if (search) {
      where.OR = [
        { bio: { contains: search, mode: "insensitive" } },
        { user: { profile: { name: { contains: search, mode: "insensitive" } } } },
      ]
    }

    // Add expertise filter
    if (expertise) {
      where.expertise = {
        some: {
          name: expertise,
        },
      }
    }

    // Get mentors with pagination and filters
    const mentors = await db.mentorProfile.findMany({
      where,
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
        expertise: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    })

    // Get total count for pagination
    const total = await db.mentorProfile.count({ where })

    return NextResponse.json({
      mentors,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Get mentors error:", error)
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

    // Only mentor role can create a mentor profile
    if (user.role !== "MENTOR") {
      return NextResponse.json({ error: "Only users with mentor role can create a mentor profile" }, { status: 403 })
    }

    // Check if user already has a mentor profile
    const existingProfile = await db.mentorProfile.findFirst({
      where: { userId: user.id },
    })

    if (existingProfile) {
      return NextResponse.json({ error: "You already have a mentor profile" }, { status: 409 })
    }

    const body = await req.json()

    // Create mentor profile
    const mentorProfile = await db.mentorProfile.create({
      data: {
        bio: body.bio,
        yearsOfExperience: body.yearsOfExperience,
        company: body.company,
        position: body.position,
        linkedIn: body.linkedIn,
        availability: body.availability,
        userId: user.id,
        expertise: {
          connectOrCreate: body.expertise.map((exp: string) => ({
            where: { name: exp },
            create: { name: exp },
          })),
        },
      },
      include: {
        expertise: true,
      },
    })

    return NextResponse.json(mentorProfile, { status: 201 })
  } catch (error) {
    console.error("Create mentor profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

