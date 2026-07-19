import OpenAI from "openai";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/errors.js";
import { logger } from "../../utils/logger.js";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIProvider {
  name: string;
  complete(messages: AIMessage[], options?: { temperature?: number }): Promise<string>;
  stream(
    messages: AIMessage[],
    onChunk: (chunk: string) => void,
    options?: { temperature?: number }
  ): Promise<string>;
}

class OpenAIProvider implements AIProvider {
  name = "openai";
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async complete(messages: AIMessage[], options?: { temperature?: number }): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: options?.temperature ?? 0.7,
    });
    return response.choices[0]?.message?.content?.trim() || "";
  }

  async stream(
    messages: AIMessage[],
    onChunk: (chunk: string) => void,
    options?: { temperature?: number }
  ): Promise<string> {
    const stream = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: options?.temperature ?? 0.7,
      stream: true,
    });

    let full = "";
    for await (const part of stream) {
      const content = part.choices[0]?.delta?.content || "";
      if (content) {
        full += content;
        onChunk(content);
      }
    }
    return full;
  }
}

class GroqProvider implements AIProvider {
  name = "groq";
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  async complete(messages: AIMessage[], options?: { temperature?: number }): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: options?.temperature ?? 0.7,
    });
    return response.choices[0]?.message?.content?.trim() || "";
  }

  async stream(
    messages: AIMessage[],
    onChunk: (chunk: string) => void,
    options?: { temperature?: number }
  ): Promise<string> {
    const stream = await this.client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: options?.temperature ?? 0.7,
      stream: true,
    });

    let full = "";
    for await (const part of stream) {
      const content = part.choices[0]?.delta?.content || "";
      if (content) {
        full += content;
        onChunk(content);
      }
    }
    return full;
  }
}

class GeminiProvider implements AIProvider {
  name = "gemini";
  constructor(private apiKey: string) {}

  private toGeminiContents(messages: AIMessage[]) {
    const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n");
    const contents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
    return { system, contents };
  }

  async complete(messages: AIMessage[], options?: { temperature?: number }): Promise<string> {
    const { system, contents } = this.toGeminiContents(messages);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents,
        generationConfig: { temperature: options?.temperature ?? 0.7 },
      }),
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new AppError(`Gemini API error: ${errText}`, 502);
    }
    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    return data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
  }

  async stream(
    messages: AIMessage[],
    onChunk: (chunk: string) => void,
    options?: { temperature?: number }
  ): Promise<string> {
    const { system, contents } = this.toGeminiContents(messages);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${this.apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents,
        generationConfig: { temperature: options?.temperature ?? 0.7 },
      }),
    });

    if (!response.ok || !response.body) {
      const errText = await response.text();
      throw new AppError(`Gemini API error: ${errText}`, 502);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let full = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const parsed = JSON.parse(payload) as {
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          const text =
            parsed.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
          if (text) {
            full += text;
            onChunk(text);
          }
        } catch {
          // ignore partial SSE chunks
        }
      }
    }

    if (!full) {
      return this.complete(messages, options);
    }
    return full;
  }
}

export function getAIProvider(): AIProvider {
  const provider = env.AI_PROVIDER || "groq";

  switch (provider) {
    case "openai":
      if (!env.OPENAI_API_KEY) {
        throw new AppError("OPENAI_API_KEY is not configured", 500);
      }
      return new OpenAIProvider(env.OPENAI_API_KEY);
    case "groq":
      if (!env.GROQ_API_KEY) {
        throw new AppError("GROQ_API_KEY is not configured", 500);
      }
      return new GroqProvider(env.GROQ_API_KEY);
    default:
      if (!env.GEMINI_API_KEY) {
        throw new AppError("GEMINI_API_KEY is not configured", 500);
      }
      return new GeminiProvider(env.GEMINI_API_KEY);
  }
}

export async function safeAIComplete(
  messages: AIMessage[],
  options?: { temperature?: number }
): Promise<string> {
  try {
    const provider = getAIProvider();
    return await provider.complete(messages, options);
  } catch (error) {
    logger.error("AI completion failed", error);
    if (error instanceof AppError) throw error;
    throw new AppError(
      "AI service is temporarily unavailable. Please try again in a moment.",
      503
    );
  }
}
