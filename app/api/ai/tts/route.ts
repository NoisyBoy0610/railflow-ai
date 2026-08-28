import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, lang = 'hi' } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && text) {
      // Use OpenAI high-fidelity neural natural voice (Nova/Shimmer are warm, human female conversational voices)
      const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: 'nova', // Warm, clear, natural human voice
          response_format: 'mp3',
          speed: 0.95
        })
      });

      if (ttsResponse.ok) {
        const audioBuffer = await ttsResponse.arrayBuffer();
        return new NextResponse(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
    }

    return NextResponse.json({ success: false, reason: 'NO_KEY_OR_FAILED' }, { status: 200 });
  } catch (error) {
    console.error('Server TTS error:', error);
    return NextResponse.json({ success: false, error: 'TTS_FAILED' }, { status: 500 });
  }
}
