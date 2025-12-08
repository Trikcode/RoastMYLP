import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const supabase = await createClient()

    // Insert email into leads table
    const { error } = await supabase.from("leads").insert({ email })

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === "23505") {
        // Return success even for duplicates (don't reveal if email exists)
        return NextResponse.json({ success: true })
      }
      console.error("[v0] Database error:", error)
      return NextResponse.json({ error: "Failed to save email" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Unlock advice error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
