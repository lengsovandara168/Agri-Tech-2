import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.chat.deleteMany({
      where: { userId: parseInt(userId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting all chats:', error);
    return NextResponse.json(
      { error: 'Failed to delete all chats' },
      { status: 500 }
    );
  }
}
