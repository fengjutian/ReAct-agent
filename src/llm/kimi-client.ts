import { LLMClient } from "../core/types";
import OpenAI from "openai";

/**
 * Kimi LLM client implementation
 * Uses the OpenAI-compatible API provided by Moonshot AI
 * Kimi is a large AI model developed by Moonshot AI
 */
export class KimiClient implements LLMClient {
  private client: OpenAI;

  /**
   * Creates a new Kimi client
   * @param apiKey The Kimi API key from Moonshot AI
   */
  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey, baseURL: "https://api.moonshot.cn/v1/" });
  }

  /**
   * Calls the Kimi API with a prompt
   * @param prompt The prompt to send to the LLM
   * @param opts Optional parameters for the LLM call
   * @returns The LLM's response as a string
   */
  async call(prompt: string, opts?: { model?: string; temperature?: number }): Promise<string> {
    const model = opts?.model || "kimi-k2-0905-preview";
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