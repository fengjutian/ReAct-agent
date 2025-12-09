import { LLMClient } from "../core/types";
import OpenAI from "openai";

/**
 * OpenAI LLM client implementation
 * Uses the official OpenAI SDK to interact with OpenAI's models
 */
export class OpenAIClient implements LLMClient {
  private client: OpenAI;

  /**
   * Creates a new OpenAI client
   * @param apiKey The OpenAI API key
   */
  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  /**
   * Calls the OpenAI API with a prompt
   * @param prompt The prompt to send to the LLM
   * @param opts Optional parameters for the LLM call
   * @returns The LLM's response as a string
   */
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