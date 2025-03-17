import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"
import { sign } from "jsonwebtoken"
import { sendEmail } from "@/lib/email"

// Validation schema for password reset request
const requestResetSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate request body
    const result = requestResetSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input", details: result.error.flatten().fieldErrors }, { status: 400 })
    }

    const { email } = result.data

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    })

    // Don't reveal if user exists or not for security
    if (!user) {
      return NextResponse.json({
        message: "If your email is registered, you will receive a password reset link",
      })
    }

    // Create reset token
    const resetToken = sign({ userId: user.id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "1h" })

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

    // Send email with reset link
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    })

    return NextResponse.json({
      message: "If your email is registered, you will receive a password reset link",
    })
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

