import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "STARTUP") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const startup = await db.startup.findUnique({
      where: { userId: user.id },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup profile not found" }, { status: 404 })
    }

    return NextResponse.json(startup)
  } catch (error) {
    console.error("Error fetching startup profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "STARTUP") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const formData = await request.formData()

    // Extract and validate form data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const industry = formData.get("industry") as string
    const website = formData.get("website") as string
    const logo = formData.get("logo") as string
    const stage = formData.get("stage") as string

    // Parse numeric values
    const foundedYear = formData.get("foundedYear") ? Number.parseInt(formData.get("foundedYear") as string) : null

    const teamSize = formData.get("teamSize") ? Number.parseInt(formData.get("teamSize") as string) : null

    const fundingRaised = formData.get("fundingRaised")
      ? Number.parseFloat(formData.get("fundingRaised") as string)
      : null

    // Basic validation
    if (!name || !description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    // Update or create startup profile
    const startup = await db.startup.upsert({
      where: { userId: user.id },
      update: {
        name,
        description,
        industry,
        website,
        logo,
        stage,
        foundedYear,
        teamSize,
        fundingRaised,
      },
      create: {
        userId: user.id,
        name,
        description,
        industry,
        website,
        logo,
        stage,
        foundedYear,
        teamSize,
        fundingRaised,
      },
    })

    return NextResponse.json(startup)
  } catch (error) {
    console.error("Error updating startup profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "STARTUP") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const data = await request.json()

    // Check if startup profile exists
    const existingStartup = await db.startup.findUnique({
      where: { userId: user.id },
    })

    if (!existingStartup) {
      return NextResponse.json({ error: "Startup profile not found" }, { status: 404 })
    }

    // Update startup profile
    const startup = await db.startup.update({
      where: { userId: user.id },
      data,
    })

    return NextResponse.json(startup)
  } catch (error) {
    console.error("Error updating startup profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE() {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (user.role !== "STARTUP") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    // Delete startup profile
    await db.startup.delete({
      where: { userId: user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting startup profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

