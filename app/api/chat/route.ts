import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json(); // get request body
    console.log('Received data:', data);

    // Simulate AI response
    const userMessage = data.prompt || '';
    const aiReply = `You said: "${userMessage}"`;

    return NextResponse.json({ message: aiReply });
  } catch (error) {
    console.error('Error in API:', error);
    return NextResponse.json(
      { message: 'Error processing request' },
      { status: 500 }
    );
  }
}
