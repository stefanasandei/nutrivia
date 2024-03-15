import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { env } from '@/env';

export const runtime = 'edge';

const openai = new OpenAI({
    apiKey: 'ollama',
    baseURL: env.OLLAMA_API_ENDPOINT,
});

const system = `You are a chef's assistant. You have to provide interesting and healthy recipes upon request. You will format the recipes using markdown.
The recipe will have three categories: "Brief description", "Ingredients" and "Instructions". Each of these sections will start with a "#", clearly marked as a new section.
The user has entered the following preferences: 
`;

export async function POST(req: Request) {
    const { prompt } = (await req.json()) as { prompt: string };

    const response = await openai.chat.completions.create({
        model: 'mistral',
        max_tokens: 800,
        temperature: 0.8,
        stream: true,
        messages: [
            { role: "system", content: system },
            { role: "user", content: prompt }],
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}
