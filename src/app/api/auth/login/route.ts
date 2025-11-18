import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username?.trim() || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing username or password' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check verification
    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, error: 'Please verify your email before logging in' },
        { status: 403 }
      );
    }

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
    });

    // Set httpOnly cookie with userId for session management
    response.cookies.set('userId', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
