import { LLMClient } from "../core/types";
/**
 * Qwen LLM client implementation
 * Uses the OpenAI-compatible API provided by Alibaba Cloud
 * Qwen is a large AI model developed by Alibaba Cloud
 */
export declare class QwenClient implements LLMClient {
    private client;
    /**
     * Creates a new Qwen client
     * @param apiKey The Qwen API key from Alibaba Cloud
     */
    constructor(apiKey: string);
    /**
     * Calls the Qwen API with a prompt
     * @param prompt The prompt to send to the LLM
     * @param opts Optional parameters for the LLM call
     * @returns The LLM's response as a string
     */
    call(prompt: string, opts?: {
        model?: string;
        temperature?: number;
    }): Promise<string>;
}
