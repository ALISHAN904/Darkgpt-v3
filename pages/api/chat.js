// Uses OpenRouter (https://openrouter.ai) — one API for many models
// (GPT, Claude, Llama, DeepSeek, Gemini, etc.)

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Change this to any model slug from https://openrouter.ai/models
// Free-tier friendly examples: "meta-llama/llama-3.1-8b-instruct:free",
// "google/gemini-2.0-flash-exp:free", "deepseek/deepseek-chat"
const MODEL = "deepseek/deepseek-chat";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const chatHistory = (history || []).map((h) => ({
      role: h.role === "user" ? "user" : "assistant",
      content: h.text,
    }));

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        // Optional but recommended by OpenRouter for analytics/rate limits
        "HTTP-Referer": "https://darkgpt-ai.vercel.app",
        "X-Title": "DarkGPT AI",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You are DarkGPT, a helpful and concise AI assistant." },
          ...chatHistory,
          { role: "user", content: message },
        ],
        max_tokens: 1024,
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "OpenRouter request failed. Check your API key.",
      });
    }

    const reply = data.choices?.[0]?.message?.content || "No response generated.";
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return res.status(500).json({
      error: "Something went wrong talking to OpenRouter. Check your API key and try again.",
    });
  }
}
