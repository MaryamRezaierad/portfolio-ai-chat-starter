import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const userMessage = data.message || '';

    // Fetch all portfolio knowledge from Supabase
    const { data: portfolioData, error } = await supabase
      .from('portfolio_knowledge')
      .select('project, type, title, content, tags')
      .order('project', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
    }

    // Format portfolio data for AI context
    let contextText = '';
    if (portfolioData && portfolioData.length > 0) {
      contextText = portfolioData.map(item => 
        `Project: ${item.project}\nType: ${item.type}\nTitle: ${item.title}\nContent: ${item.content}\nTags: ${item.tags}\n---`
      ).join('\n\n');
    }

    // Create AI completion with portfolio context
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an AI assistant representing Maryam's UX design portfolio. Answer questions about her projects, design process, and work based on the following portfolio data:

${contextText}

Be helpful, professional, and reference specific projects when relevant. If asked about something not in the data, politely say you don't have that information.`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const aiReply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({ message: aiReply });
  } catch (error) {
    console.error('Error in API:', error);
    return NextResponse.json(
      { message: 'Error processing request. Please try again.' },
      { status: 500 }
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
