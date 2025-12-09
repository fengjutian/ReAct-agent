import { LLMClient } from "./types";
export declare class Reasoner {
    private llm;
    constructor(llm: LLMClient);
    buildPrompt(userQuery: string, history: string[]): string;
    think(userQuery: string, history: string[]): Promise<string>;
}
