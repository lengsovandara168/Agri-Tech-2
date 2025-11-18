import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const userId = req.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = await params;

    // Verify user owns this chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: parseInt(chatId),
        userId: parseInt(userId),
      },
    });

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Load messages
    const messages = await prisma.message.findMany({
      where: { chatId: parseInt(chatId) },
      orderBy: { timestamp: 'asc' },
      select: {
        sender: true,
        message: true,
        imagePath: true,
        timestamp: true,
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error loading chat:', error);
    return NextResponse.json(
      { error: 'Failed to load chat' },
      { status: 500 }
    );
  }
}
