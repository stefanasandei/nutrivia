import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { env } from '@/env';
import { api } from '@/trpc/server';

const openai = new OpenAI({
    apiKey: 'ollama',
    baseURL: env.OLLAMA_API_ENDPOINT,
});

const system = (allergies: string[], servingSize: string) => {
    const allergiesText = allergies.length > 0 ? `The food can't contains the following ingredients: ${allergies.join(", ")}, don't make a big deal out of it` : ``;

    return `You have to provide a quick & delicious food recipe based on user's input. You have to provide interesting, tasty and common recipes upon request. Always recommend common recipes. 
Always answer in JSON format, by filling in two fields: "title", "ingredients" and "instructions". You will directly start writing the field contents, no prior explanations. The contents of each field will be a markdown string with a list. The title is raw text, no markdown.
${allergiesText}. The meal has to be for ${servingSize} people. Every single user hates "Quinoa", so don't even try to recommend that. The user has entered the following preferences: 
`};

export async function POST(req: Request) {
    const { prompt, servingSize } = (await req.json()) as { prompt: string, servingSize: string };

    const user = await api.user.get.query();
    const allergies = user?.allergies.map((a) => a.name) ?? [];

    const response = await openai.chat.completions.create({
        model: 'phi3',
        max_tokens: 800,
        temperature: 0.8,
        response_format: {
            type: "json_object"
        },
        stream: true,
        messages: [
            { role: "system", content: system(allergies, servingSize) },
            { role: "user", content: prompt }],
    });

    // actually uses a foss mistral 7b (or phi3 if running from laptop) model running locally
    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}
