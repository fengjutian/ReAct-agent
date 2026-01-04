import { LLMClient } from "../core/types";
import OpenAI from "openai";

/**
 * Qwen LLM client implementation
 * Uses the OpenAI-compatible API provided by Alibaba Cloud
 * Qwen is a large AI model developed by Alibaba Cloud
 */
export class QwenClient implements LLMClient {
  private client: OpenAI;

  /**
   * Creates a new Qwen client
   * @param apiKey The Qwen API key from Alibaba Cloud
   */
  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    });
  }

  /**
   * Calls the Qwen API with a prompt
   * @param prompt The prompt to send to the LLM
   * @param opts Optional parameters for the LLM call
   * @returns The LLM's response as a string
   */
  async call(prompt: string, opts?: { model?: string; temperature?: number }): Promise<string> {
    const model = opts?.model || "qwen-plus";
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