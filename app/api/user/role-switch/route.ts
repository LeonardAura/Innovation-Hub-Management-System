/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/user/role-switch/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { sign, verify } from "jsonwebtoken"
import { db } from "@/lib/db"
import { getCurrentUser, JWTPayload } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // Get the current authenticated user
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get the role from the request body
    const { role } = await request.json()
    
    // Validate the role
    const validRoles = ["STARTUP", "MENTOR", "INVESTOR", "ADMIN"]
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }
    
    // Update the user's role in the database
    const updatedUser = await db.user.update({
      where: { id: currentUser.id },
      data: { role },
    })
    
    // Create a new JWT with the updated role
    const cookieStore = cookies()
    const sessionCookie = (await cookieStore).get("session")
    
    if (sessionCookie?.value) {
      // Verify the existing token to get its payload
      const payload = verify(
        sessionCookie.value, 
        process.env.JWT_SECRET || "fallback_secret"
      ) as JWTPayload
      
      // Create a new token with updated role
      const newToken = sign(
        { ...payload, role },
        process.env.JWT_SECRET || "fallback_secret",
        { expiresIn: "7d" }
      )
      
      // Set the new token in cookies
      ;(await
            // Set the new token in cookies
            cookies()).set({
        name: "session",
        value: newToken,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }
    
    // Return the updated user without the password
    const { password, ...userWithoutPassword } = updatedUser
    
    return NextResponse.json({
      message: "Role switched successfully",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Role switch error:", error)
    return NextResponse.json(
      { error: "Failed to switch role" },
      { status: 500 }
    )
  }
}