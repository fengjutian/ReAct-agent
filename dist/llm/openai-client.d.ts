import { LLMClient } from "../core/types";
export declare class OpenAIClient implements LLMClient {
    private client;
    constructor(apiKey: string);
    call(prompt: string, opts?: {
        model?: string;
        temperature?: number;
    }): Promise<string>;
}
