import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('=== API Route Called ===');
  
  try {
    const data = await req.json();
    console.log('Received data:', data);
    
    const userMessage = data.message || '';
    const aiReply = `You said: "${userMessage}"`;

    return NextResponse.json(
      { message: aiReply },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
    
  } catch (error) {
    console.error('Error in API:', error);
    return NextResponse.json(
      { message: 'Error processing request' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
