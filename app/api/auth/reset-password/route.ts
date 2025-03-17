/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import { hash } from "bcryptjs"
import { verifyToken, JWTPayload } from "@/lib/auth"

// Validation schema for password reset
const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate request body
    const result = resetPasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten().fieldErrors }, { status: 400 })
    }

    const { token, password } = result.data

    // Verify reset token
    let payload
    try {
      payload = verifyToken(token) as JWTPayload & { userId: string }
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Find user
    const user = await db.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Hash new password
    const hashedPassword = await hash(password, 10)

    // Update user password
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

