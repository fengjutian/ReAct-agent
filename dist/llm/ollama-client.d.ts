import { LLMClient } from "../core/types";
/**
 * Ollama LLM client implementation
 * Uses the REST API provided by locally deployed Ollama
 */
export declare class OllamaClient implements LLMClient {
    private baseURL;
    private defaultModel;
    /**
     * Creates a new Ollama client
     * @param opts Optional configuration for the Ollama client
     */
    constructor(opts?: {
        baseURL?: string;
        defaultModel?: string;
    });
    /**
     * Calls the Ollama API with a prompt
     * @param prompt The prompt to send to the LLM
     * @param opts Optional parameters for the LLM call
     * @returns The LLM's response as a string
     */
    call(prompt: string, opts?: {
        model?: string;
        temperature?: number;
    }): Promise<string>;
}
