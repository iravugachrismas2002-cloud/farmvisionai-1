import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey || groqApiKey === "replace-with-groq-api-key") {
      return NextResponse.json(
        { error: "Groq API key not configured. Please set GROQ_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are FarmVision AI, an agricultural assistant helping farmers with their farm operations. You can help with questions about feed levels, water levels, temperature, sensor data, and farm management. Provide practical, helpful advice based on farm sensor data and best practices.",
          },
          { role: "user", content: question },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return NextResponse.json(
        { error: "Failed to get AI response from Groq" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "No response from AI";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Ask API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}