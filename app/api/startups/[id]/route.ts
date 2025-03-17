import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Get startup by ID
    const startup = await db.startup.findUnique({
      where: { id },
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
        milestones: true,
      },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    return NextResponse.json(startup)
  } catch (error) {
    console.error("Get startup error:", error)
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

    // Get startup
    const startup = await db.startup.findUnique({
      where: { id },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    // Check if user is the owner or an admin
    if (startup.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "You don't have permission to update this startup" }, { status: 403 })
    }

    const body = await req.json()

    // Update startup
    const updatedStartup = await db.startup.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        industry: body.industry,
        foundedYear: body.foundedYear,
        website: body.website,
        logo: body.logo,
        stage: body.stage,
      },
    })

    return NextResponse.json(updatedStartup)
  } catch (error) {
    console.error("Update startup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Verify authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get startup
    const startup = await db.startup.findUnique({
      where: { id },
    })

    if (!startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 })
    }

    // Check if user is the owner or an admin
    if (startup.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "You don't have permission to delete this startup" }, { status: 403 })
    }

    // Delete startup
    await db.startup.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Startup deleted successfully" })
  } catch (error) {
    console.error("Delete startup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

