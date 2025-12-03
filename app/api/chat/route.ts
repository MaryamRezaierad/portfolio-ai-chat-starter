import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json(); // read request body
  console.log('Received data:', data);

  // Example response
  return NextResponse.json({ message: 'Hello from chat API!', received: data });
}
