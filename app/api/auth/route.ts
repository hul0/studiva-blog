import { NextResponse } from "next/server"
import { validateCredentials, createToken, setAuthCookie, removeAuthCookie } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, action } = body

    // Logout
    if (action === "logout") {
      await removeAuthCookie()
      return NextResponse.json({ success: true })
    }

    // Login
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    const isValid = validateCredentials(username, password)

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const token = await createToken()
    await setAuthCookie(token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
