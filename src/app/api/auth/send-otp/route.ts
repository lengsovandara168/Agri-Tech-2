import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, generateOTP, storeOTP, sendOTPEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    // Validate input
    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.trim() }, { username: username.trim() }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            existingUser.email === email.trim()
              ? "Email already registered"
              : "Username already taken",
        },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with user data
    storeOTP(email.trim(), otp, {
      username: username.trim(),
      email: email.trim(),
      passwordHash,
    });

    // Send OTP email
    await sendOTPEmail(email.trim(), otp);

    return NextResponse.json({
      success: true,
      message:
        "OTP sent to your email. Please check your inbox (or console in dev mode).",
    });
  } catch (error) {
    console.error("Error in send-otp:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
