import { LLMClient } from "../core/types";
import OpenAI from "openai";

/**
 * DeepSeek LLM client implementation
 * Uses the OpenAI-compatible API provided by DeepSeek
 * DeepSeek is a large AI model developed by DeepSeek Inc.
 */
export class DeepSeekClient implements LLMClient {
  private client: OpenAI;

  /**
   * Creates a new DeepSeek client
   * @param apiKey The DeepSeek API key from DeepSeek Inc.
   */
  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: "https://api.deepseek.com/v1"
    });
  }

  /**
   * Calls the DeepSeek API with a prompt
   * @param prompt The prompt to send to the LLM
   * @param opts Optional parameters for the LLM call
   * @returns The LLM's response as a string
   */
  async call(prompt: string, opts?: { model?: string; temperature?: number }): Promise<string> {
    const model = opts?.model || "deepseek-chat";
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