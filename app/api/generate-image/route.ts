import { NextRequest, NextResponse } from 'next/server';
import { GenerateImageRequest } from '@/types';

const STYLE_PROMPTS: Record<string, string> = {
  professional:
    'corporate professional business style, clean, modern office environment, blue and white palette, high quality',
  minimal:
    'minimalist design, clean white background, simple geometric shapes, elegant typography, zen aesthetic',
  colorful:
    'vibrant colors, energetic, modern graphic design, bold palette, creative and dynamic',
  abstract:
    'abstract art, flowing shapes, creative composition, artistic, expressive brushstrokes',
};

export async function POST(request: NextRequest) {
  const body: GenerateImageRequest = await request.json();
  const { prompt, style } = body;

  if (!prompt?.trim()) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  const styleModifier = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.professional;
  const fullPrompt = `LinkedIn banner, ${prompt}, ${styleModifier}, professional quality, no text`;

  // Return the URL directly — browser loads the image, no server-side proxying
  const encodedPrompt = encodeURIComponent(fullPrompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true&seed=${Date.now()}`;

  return NextResponse.json({ url });
}
