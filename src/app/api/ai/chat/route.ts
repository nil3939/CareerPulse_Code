import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY || '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';
const PRIMARY_MODEL = process.env.OPENROUTER_MODEL || 'openrouter/free';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, systemPrompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://careerpulse.com.bd',
        'X-Title': 'CareerPulse AI'
      },
      body: JSON.stringify({
        model: PRIMARY_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt || 'You are CareerPulse AI, an expert computer science and career intelligence AI assistant for software developers and recruiters in Bangladesh. Provide clean Markdown responses.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const output = data.choices?.[0]?.message?.content;
      if (output && output.trim().length > 0) {
        return NextResponse.json({ text: output.trim() });
      }
    } else {
      const errText = await response.text();
      console.error('OpenRouter Server API Error:', response.status, errText);
    }
  } catch (error: any) {
    console.error('AI Chat API Exception:', error);
  }

  // Fallback fallback response if OpenRouter network is slow
  return NextResponse.json({ text: '' });
}
