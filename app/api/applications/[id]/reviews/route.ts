import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"

// Validation schema for review
const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, { message: "Comment is required" }),
})

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const applicationId = params.id

    // Verify authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins and mentors can review applications
    if (user.role !== "ADMIN" && user.role !== "MENTOR") {
      return NextResponse.json({ error: "Only admins and mentors can review applications" }, { status: 403 })
    }

    // Check if application exists
    const application = await db.application.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const body = await req.json()

    // Validate request body
    const result = reviewSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten().fieldErrors }, { status: 400 })
    }

    // Check if user has already reviewed this application
    const existingReview = await db.applicationReview.findFirst({
      where: {
        applicationId,
        reviewerId: user.id,
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this application" }, { status: 409 })
    }

    // Create review
    const review = await db.applicationReview.create({
      data: {
        applicationId,
        reviewerId: user.id,
        rating: body.rating,
        comment: body.comment,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Create review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

