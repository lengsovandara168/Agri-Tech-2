import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { queryText, queryTextWithImage, queryImage, embedText } from '@/lib/gemini';
import path from 'path';
import fs from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { message, image, imageMimeType, chatId } = body;

    if (!message && !image) {
      return NextResponse.json(
        { response: 'Please enter a message or upload an image.' },
        { status: 400 }
      );
    }

    let activeChatId = chatId;
    let newChatInfo: { chatId: number; title: string } | null = null;

    // Create new chat if needed
    if (!activeChatId) {
      const title = (message || '[Image]').slice(0, 40);
      const chat = await prisma.chat.create({
        data: {
          userId: parseInt(userId),
          title,
        },
      });
      activeChatId = chat.id;
      newChatInfo = { chatId: chat.id, title: chat.title };
    }

    // Handle image upload
    let imagePath: string | null = null;
    let dbImagePath: string | null = null;
    if (image) {
      const uploadFolder = process.env.UPLOAD_FOLDER || path.join(process.cwd(), '..', 'static', 'uploads');
      await fs.mkdir(uploadFolder, { recursive: true });

      const timestamp = Date.now();
      const filename = `${timestamp}_${Math.random().toString(36).substring(7)}.jpg`;
      const fullPath = path.join(uploadFolder, filename);

      // Decode base64 and save
      const imageBuffer = Buffer.from(image, 'base64');
      await fs.writeFile(fullPath, imageBuffer);

      imagePath = fullPath;
      dbImagePath = `/static/uploads/${filename}`;
    }

    // Generate AI response
    let reply: string;
    if (image && message) {
      reply = await queryTextWithImage(message, image, imageMimeType || 'image/jpeg');
    } else if (image) {
      reply = await queryImage(image, imageMimeType || 'image/jpeg');
    } else {
      reply = await queryText(message);
    }

    if (!reply) {
      reply = 'Sorry, I could not generate a response.';
    }

    // Generate embeddings for text messages
    const userEmbedding = message ? await embedText(message) : null;
    const assistantEmbedding = reply ? await embedText(reply) : null;

    // Save user message to database
    if (userEmbedding && userEmbedding.length > 0) {
      // Use raw SQL for pgvector
      await prisma.$executeRaw`
        INSERT INTO "Message" ("chatId", "sender", "message", "imagePath", "embedding", "createdAt")
        VALUES (${activeChatId}, 'user', ${message || '[Image]'}, ${dbImagePath}, ${`[${userEmbedding.join(',')}]`}::vector, NOW())
      `;
    } else {
      await prisma.message.create({
        data: {
          chatId: activeChatId,
          sender: 'user',
          message: message || '[Image]',
          imagePath: dbImagePath,
        },
      });
    }

    // Save assistant message to database
    if (assistantEmbedding && assistantEmbedding.length > 0) {
      await prisma.$executeRaw`
        INSERT INTO "Message" ("chatId", "sender", "message", "embedding", "createdAt")
        VALUES (${activeChatId}, 'assistant', ${reply}, ${`[${assistantEmbedding.join(',')}]`}::vector, NOW())
      `;
    } else {
      await prisma.message.create({
        data: {
          chatId: activeChatId,
          sender: 'assistant',
          message: reply,
        },
      });
    }

    const responseData: { response: string; newChat?: { chatId: number; title: string } } = { response: reply };
    if (newChatInfo) {
      responseData.newChat = newChatInfo;
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { response: 'Error processing request.' },
      { status: 500 }
    );
  }
}
