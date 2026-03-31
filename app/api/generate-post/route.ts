import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { GeneratePostRequest } from '@/types';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const LENGTH_MAP = {
  short:  { target: 300,  min: 250,  max: 380,  minWords: 45,  maxWords: 65,  maxTokens: 512  },
  medium: { target: 600,  min: 500,  max: 720,  minWords: 90,  maxWords: 125, maxTokens: 900  },
  long:   { target: 1000, min: 850,  max: 1150, minWords: 155, maxWords: 200, maxTokens: 1600 },
};

const TYPE_INSTRUCTIONS: Record<string, string> = {
  'thought-leadership': 'Share an expert insight that positions the author as an industry leader. Open with a bold, counterintuitive statement.',
  'personal-story': 'Tell a personal narrative with a relatable challenge and lesson learned. Be authentic and vulnerable.',
  'how-to': 'Provide a clear, numbered step-by-step guide. Make it immediately actionable.',
  'company-update': 'Share exciting company news or milestone in an engaging way. Include impact and future vision.',
  'question': 'Ask a thought-provoking question to spark discussion. Include context and your own perspective.',
  'announcement': 'Make a compelling announcement. Include what, why, and what it means for the audience.',
};

const TONE_INSTRUCTIONS: Record<string, string> = {
  professional: 'Use formal, polished language appropriate for business professionals.',
  conversational: 'Write in a friendly, approachable tone as if talking to a colleague.',
  inspiring: 'Use motivational, uplifting language that energizes and encourages.',
  storytelling: 'Craft a narrative arc with a beginning, middle, and memorable end.',
  analytical: 'Use data-driven, logical language with specific insights and evidence.',
};

const VARIATION_ANGLES = [
  'Focus on the personal journey and emotional angle.',
  'Focus on practical, actionable takeaways with a data-driven angle.',
  'Focus on a bold, provocative opening that challenges conventional wisdom.',
];

function buildPrompt(topic: string, postType: string, tone: string, length: string, variationAngle: string) {
  const cfg = LENGTH_MAP[length as keyof typeof LENGTH_MAP] ?? LENGTH_MAP.medium;
  return `You are an expert LinkedIn content creator. Generate a high-quality LinkedIn post.

STRICT LENGTH RULE — read before writing:
Write between ${cfg.minWords} and ${cfg.maxWords} words (≈ ${cfg.min}–${cfg.max} characters).
This is non-negotiable. If your draft is under ${cfg.minWords} words, expand it before responding.

Topic: ${topic}
Post Type: ${postType} - ${TYPE_INSTRUCTIONS[postType] ?? ''}
Tone: ${tone} - ${TONE_INSTRUCTIONS[tone] ?? ''}
Angle for this variation: ${variationAngle}

Content rules:
- Write ONLY the post body (no preamble, no "Here is your post:", no meta-commentary)
- Hook opening line that stops the scroll
- Use strategic line breaks for LinkedIn readability
- Every point must include a concrete detail, example, or stat — no filler sentences
- Close with a clear call-to-action

After the post body, on a new line add exactly:
HASHTAGS: #tag1 #tag2 #tag3 #tag4 #tag5
CTA: [one sentence call to action]`;
}

// Streaming endpoint — returns raw text as a stream
export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured. Add it to .env.local' },
        { status: 500 }
      );
    }

    const body: GeneratePostRequest & { variationIndex?: number; stream?: boolean } = await request.json();
    const { topic, postType, tone, length, variationIndex, stream: wantStream } = body;

    if (!topic?.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const angle = VARIATION_ANGLES[variationIndex ?? 0] ?? VARIATION_ANGLES[0];
    const prompt = buildPrompt(topic, postType, tone, length, angle);
    const temperature = 0.85 + (variationIndex ?? 0) * 0.05;
    const maxTokens = (LENGTH_MAP[length as keyof typeof LENGTH_MAP] ?? LENGTH_MAP.medium).maxTokens;

    // ── Streaming mode ──────────────────────────────────────────────────────
    if (wantStream) {
      const groqStream = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          for await (const chunk of groqStream) {
            const text = chunk.choices[0]?.delta?.content ?? '';
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // ── Non-streaming fallback ──────────────────────────────────────────────
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    });

    const raw = completion.choices[0]?.message?.content ?? '';
    return NextResponse.json({ raw });
  } catch (error) {
    console.error('Generate post error:', error);
    return NextResponse.json({ error: 'Failed to generate post. Please try again.' }, { status: 500 });
  }
}
