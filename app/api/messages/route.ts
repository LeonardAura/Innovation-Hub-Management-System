import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"

// Validation schema for message
const messageSchema = z.object({
  recipientId: z.string(),
  content: z.string().min(1, { message: "Message content is required" }),
})

export async function GET(req: Request) {
  try {
    // Verify authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const conversationWithUserId = searchParams.get("userId")

    // If userId is provided, get conversation with that user
    if (conversationWithUserId) {
      const messages = await db.message.findMany({
        where: {
          OR: [
            {
              senderId: user.id,
              recipientId: conversationWithUserId,
            },
            {
              senderId: conversationWithUserId,
              recipientId: user.id,
            },
          ],
        },
        include: {
          sender: {
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
          recipient: {
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
        orderBy: { createdAt: "asc" },
      })

      return NextResponse.json(messages)
    }

    // Otherwise, get all conversations
    const conversations = await db.message.findMany({
      where: {
        OR: [{ senderId: user.id }, { recipientId: user.id }],
      },
      include: {
        sender: {
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
        recipient: {
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
      orderBy: { createdAt: "desc" },
    })

    // Group messages by conversation
    const conversationMap = new Map()

    conversations.forEach((message) => {
      const otherUserId = message.senderId === user.id ? message.recipientId : message.senderId
      const otherUser = message.senderId === user.id ? message.recipient : message.sender

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: otherUser,
          lastMessage: message,
        })
      }
    })

    return NextResponse.json(Array.from(conversationMap.values()))
  } catch (error) {
    console.error("Get messages error:", error)
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

    const body = await req.json()

    // Validate request body
    const result = messageSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten().fieldErrors }, { status: 400 })
    }

    // Check if recipient exists
    const recipient = await db.user.findUnique({
      where: { id: body.recipientId },
    })

    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 })
    }

    // Create message
    const message = await db.message.create({
      data: {
        content: body.content,
        senderId: user.id,
        recipientId: body.recipientId,
      },
      include: {
        sender: {
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
        recipient: {
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
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("Create message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

