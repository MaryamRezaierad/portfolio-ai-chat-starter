import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Groq from "groq-sdk";

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Initialize clients with error checking
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error("Missing Supabase credentials");
}

if (!process.env.GROQ_API_KEY) {
  console.error("Missing Groq API key");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  message: string;
  conversationHistory?: Message[];
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    // 1. Query Supabase for relevant portfolio content
    const { data: portfolioData, error: dbError } = await supabase
      .from("portfolio_knowledge")
      .select("*")
      .ilike("content", `%${message}%`)
      .limit(5);

    if (dbError) {
      console.error("Supabase error:", dbError);
    }

    // 2. Build context from portfolio data
    let context = "";
    if (portfolioData && portfolioData.length > 0) {
      context = portfolioData
        .map((row) => {
          return `Project: ${row.project || "N/A"}
Type: ${row.type || "N/A"}
Title: ${row.title || "N/A"}
Content: ${row.content || "N/A"}
${row.tags ? `Tags: ${row.tags}` : ""}
---`;
        })
        .join("\n\n");
    } else {
      context = "No specific portfolio information found for this query.";
    }

    // 3. Build the system prompt
    const systemPrompt = `You are a helpful AI assistant for a UX/Product Designer's portfolio.

Your role:
- Answer questions about their work, projects, process, and experience
- Be concise and professional
- Focus on research → design decisions → outcomes
- If information isn't in the portfolio knowledge base, politely say you don't have that information

Portfolio Context:
${context}

Guidelines:
- Only discuss what's in the portfolio knowledge base
- Be friendly but professional
- Keep responses focused and relevant
- If asked about something not in the portfolio, say "I don't have information about that in the portfolio"`;

    // 4. Prepare messages for Groq
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-6), // Last 3 exchanges
      { role: "user", content: message },
    ];

    // 5. Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: messages as any,
      model: "llama-3.3-70b-versatile", // Fast and good quality
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Chat API is running. Use POST to send messages." },
    { status: 200 }
  );
}
