import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  
  // Clear the userId cookie
  response.cookies.delete('userId');
  
  return response;
}
