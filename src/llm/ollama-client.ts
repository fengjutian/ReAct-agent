import { LLMClient } from "../core/types";
import fetch from "node-fetch";

/**
 * Ollama LLM client implementation
 * Uses the REST API provided by locally deployed Ollama
 */
export class OllamaClient implements LLMClient {
  private baseURL: string;
  private defaultModel: string;

  /**
   * Creates a new Ollama client
   * @param opts Optional configuration for the Ollama client
   */
  constructor(opts?: { baseURL?: string; defaultModel?: string }) {
    this.baseURL = opts?.baseURL || "http://localhost:11434";
    this.defaultModel = opts?.defaultModel || "llama3";
  }

  /**
   * Calls the Ollama API with a prompt
   * @param prompt The prompt to send to the LLM
   * @param opts Optional parameters for the LLM call
   * @returns The LLM's response as a string
   */
  async call(prompt: string, opts?: { model?: string; temperature?: number }): Promise<string> {
    const model = opts?.model || this.defaultModel;
    const temperature = opts?.temperature ?? 0.2;

    try {
      const response = await fetch(`${this.baseURL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false, // 不使用流式响应
          temperature,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // 使用类型断言确保TypeScript不会报错
      return (data as any).response || "";
    } catch (error) {
      console.error("Ollama client error:", error);
      throw new Error(`Failed to call Ollama: ${(error as Error).message}`);
    }
  }
}