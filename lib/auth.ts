/* eslint-disable @typescript-eslint/no-unused-vars */
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { db } from "./db"

// Type for the JWT payload
export type JWTPayload = {
  id: string
  email: string
  role: string
  iat: number
  exp: number
}

// Get the current user from the session
export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const sessionCookie = (await cookieStore).get("session")

    if (!sessionCookie?.value) {
      return null
    }

    // Verify the token
    const payload = verify(sessionCookie.value, process.env.JWT_SECRET || "fallback_secret") as JWTPayload

    // Get the user from the database
    const user = await db.user.findUnique({
      where: { id: payload.id },
      include: {
        profile: true,
      },
    })

    if (!user) {
      return null
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = user

    return userWithoutPassword
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

// Verify a token (used for password reset)
export function verifyToken(token: string) {
  try {
    return verify(token, process.env.JWT_SECRET || "fallback_secret") as JWTPayload
  } catch (error) {
    throw new Error("Invalid or expired token")
  }
}

