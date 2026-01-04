import { LLMClient } from "../core/types";
/**
 * DeepSeek LLM client implementation
 * Uses the OpenAI-compatible API provided by DeepSeek
 * DeepSeek is a large AI model developed by DeepSeek Inc.
 */
export declare class DeepSeekClient implements LLMClient {
    private client;
    /**
     * Creates a new DeepSeek client
     * @param apiKey The DeepSeek API key from DeepSeek Inc.
     */
    constructor(apiKey: string);
    /**
     * Calls the DeepSeek API with a prompt
     * @param prompt The prompt to send to the LLM
     * @param opts Optional parameters for the LLM call
     * @returns The LLM's response as a string
     */
    call(prompt: string, opts?: {
        model?: string;
        temperature?: number;
    }): Promise<string>;
}
