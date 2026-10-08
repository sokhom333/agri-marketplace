import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY មិនទាន់ត្រូវបានកំណត់ឡើយ' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { message } = await req.json();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction:
          'អ្នកគឺជាជំនួយការ AI ផ្នែកកសិកម្មប្រចាំ "ផ្សារដើមកសិកម្ម"។ សូមឆ្លើយតបជាភាសាខ្មែរប្រកបដោយភាពរួសរាយ រហ័ស និងផ្ដល់ប្រឹក្សាជំនាញអំពីជំងឺសត្វ ថ្នាំសត្វ ចំណីសត្វ និងការដាំដុះដំណាំ។',
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'មានបញ្ហាក្នុងការដំណើរការ' },
      { status: 500 }
    );
  }
}