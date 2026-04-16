// app/api/chat/route.ts
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { LOGISTICS_SYSTEM_PROMPT } from "@/lib/logistics-knowledge";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { message: "Invalid request. Please provide messages." },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: LOGISTICS_SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "I'm sorry, I couldn't process that. Please try again.";

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        message:
          "Sorry, something went wrong. Please try again or contact us at support@clearrouteglobal.com.",
      },
      { status: 500 }
    );
  }
}