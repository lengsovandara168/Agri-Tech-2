import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyOTP } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email?.trim() || !otp?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Missing email or OTP' },
        { status: 400 }
      );
    }

    // Verify OTP
    const verification = verifyOTP(email.trim(), otp.trim());

    if (!verification.valid) {
      return NextResponse.json(
        { success: false, error: verification.error },
        { status: 400 }
      );
    }

    // Create user
    const userData = verification.data!;
    await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        passwordHash: userData.passwordHash,
        isVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Account verified and created successfully',
    });
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
