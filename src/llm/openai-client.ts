import { LLMClient } from "../core/types";
import OpenAI from "openai";

export class OpenAIClient implements LLMClient {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async call(prompt: string, opts?: { model?: string; temperature?: number }): Promise<string> {
    const model = opts?.model || "gpt-4o-mini";
    const resp = await this.client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: opts?.temperature ?? 0.2,
      max_tokens: 800
    });

    const text = (resp as any).choices?.[0]?.message?.content ?? JSON.stringify(resp);
    return String(text);
  }
}
