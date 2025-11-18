import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { chatId, newTitle } = body;

    if (!chatId || !newTitle) {
      return NextResponse.json(
        { error: 'Missing chatId or newTitle' },
        { status: 400 }
      );
    }

    await prisma.chat.updateMany({
      where: {
        id: chatId,
        userId: parseInt(userId),
      },
      data: {
        title: newTitle,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Chat renamed successfully.',
    });
  } catch (error) {
    console.error('Error renaming chat:', error);
    return NextResponse.json(
      { error: 'Failed to rename chat' },
      { status: 500 }
    );
  }
}
