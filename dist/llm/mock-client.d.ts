import { LLMClient } from "../core/types";
export declare class MockLLMClient implements LLMClient {
    call(prompt: string): Promise<string>;
}
