/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const investors = await db.investorProfile.findMany({
      include: {
        user: {
          select: {
            profile: {
              select: {
                name: true,
                avatar: true,
                location: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(investors, { status: 200 });
  } catch (error) {
    console.error("Error fetching investors:", error);
    return NextResponse.json({ error: "Failed to fetch investors" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    // Verify authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only investor role can create an investor profile
    if (user.role !== "INVESTOR") {
      return NextResponse.json(
        { error: "Only users with investor role can create an investor profile" },
        { status: 403 },
      )
    }

    // Check if user already has an investor profile
    const existingProfile = await db.investorProfile.findFirst({
      where: { userId: user.id },
    })

    if (existingProfile) {
      return NextResponse.json({ error: "You already have an investor profile" }, { status: 409 })
    }

    const body = await req.json()

    // Create investor profile
    const investorProfile = await db.investorProfile.create({
      data: {
        bio: body.bio,
        firmName: body.firmName,
        investmentStages: body.investmentStages,
        investmentSizeLower: body.investmentSizeLower,
        investmentSizeUpper: body.investmentSizeUpper,
        portfolioSize: body.portfolioSize,
        linkedIn: body.linkedIn,
        website: body.website,
        userId: user.id,
        industries: body.industries,
      },
    })

    return NextResponse.json(investorProfile, { status: 201 })
  } catch (error) {
    console.error("Create investor profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

