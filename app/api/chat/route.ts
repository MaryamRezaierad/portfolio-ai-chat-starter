import { NextRequest, NextResponse } from 'next/server';

// Helper function to create response with CORS headers
function corsResponse(data: any, status: number = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  console.log('=== API Route Called ===');
  
  try {
    const data = await req.json();
    console.log('Received data:', data);
    
    const userMessage = data.prompt || '';
    const aiReply = `You said: "${userMessage}"`;

    return corsResponse({ message: aiReply });
    
  } catch (error) {
    console.error('Error in API:', error);
    return corsResponse(
      { message: 'Error processing request' },
      500
    );
  }
}
