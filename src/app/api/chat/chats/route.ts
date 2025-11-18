import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// List all chats for the user
export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chats = await prisma.chat.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Error listing chats:', error);
    return NextResponse.json(
      { error: 'Failed to list chats' },
      { status: 500 }
    );
  }
}

// Delete a single chat
export async function DELETE(req: NextRequest) {
  try {
    const userId = req.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { chatId } = body;

    if (!chatId) {
      return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });
    }

    await prisma.chat.deleteMany({
      where: {
        id: chatId,
        userId: parseInt(userId),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat' },
      { status: 500 }
    );
  }
}
