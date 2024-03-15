import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { env } from '@/env';
import { api } from '@/trpc/server';

const openai = new OpenAI({
    apiKey: 'ollama',
    baseURL: env.OLLAMA_API_ENDPOINT,
});

const system = (allergies: string[]) => {
    const allergiesText = allergies.length > 0 ? `The food can't contains the following ingredients: ${allergies.join(", ")}. ` : ``;

    return `You are a chef's assistant. You have to provide interesting and healthy recipes upon request. You will format the recipes using markdown.
The recipe will have three categories: "Brief description", "Ingredients" and "Instructions". Each of these sections will start with a "#", clearly marked as a new section.
${allergiesText} The user has entered the following preferences: 
`};

export async function POST(req: Request) {
    const { prompt } = (await req.json()) as { prompt: string };

    const user = await api.user.get.query();
    const allergies = user?.allergies.map((a) => a.name) ?? [];

    const response = await openai.chat.completions.create({
        model: 'mistral',
        max_tokens: 800,
        temperature: 0.8,
        stream: true,
        messages: [
            { role: "system", content: system(allergies) },
            { role: "user", content: prompt }],
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}
