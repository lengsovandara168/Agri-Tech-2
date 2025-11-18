import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

const TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-flash';
const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';

// Lazily get the model each call to allow env overrides
const getTextModel = () => genAI.getGenerativeModel({ model: TEXT_MODEL });

/**
 * Query Gemini with text only
 */
export async function queryText(text: string): Promise<string> {
  try {
    const result = await getTextModel().generateContent(text);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error in queryText:', error);
    throw new Error('Failed to get response from Gemini AI');
  }
}

/**
 * Query Gemini with image only
 */
export async function queryImage(
  base64Image: string,
  mimeType: string
): Promise<string> {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const result = await getTextModel().generateContent([
      'Describe this image in detail.',
      imagePart,
    ]);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error in queryImage:', error);
    throw new Error('Failed to analyze image with Gemini AI');
  }
}

/**
 * Query Gemini with both text and image
 */
export async function queryTextWithImage(
  text: string,
  base64Image: string,
  mimeType: string
): Promise<string> {
  try {
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    const result = await getTextModel().generateContent([text, imagePart]);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error in queryTextWithImage:', error);
    throw new Error('Failed to get response from Gemini AI');
  }
}

/**
 * Get text embeddings for semantic search / retrieval.
 */
export async function embedText(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const res = await model.embedContent(text);
    return (res.embedding.values as number[]) || [];
  } catch (error) {
    console.error('Error in embedText:', error);
    return [];
  }
}
