import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import fs from 'fs';
import path from 'path';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Read the knowledge base file
    const knowledgeBasePath = path.join(process.cwd(), 'baseconocimiento.txt');
    const knowledgeBaseContent = fs.readFileSync(knowledgeBasePath, 'utf8');

    // Call the language model
    const result = streamText({
      model: google('gemini-1.5-flash'), // Using flash for faster chat responses
      system: knowledgeBaseContent,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
