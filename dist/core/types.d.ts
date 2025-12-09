export type ToolName = "search" | "code_exec" | "model_small" | "model_large" | "db_query" | "web_request" | "none";
export interface ReActParsed {
    thought?: string;
    action?: ToolName;
    actionInput?: any;
    finalAnswer?: string;
}
export interface HistoryItem {
    role: "agent" | "tool" | "system";
    content: string;
    meta?: any;
}
export interface LLMClient {
    call(prompt: string, opts?: {
        model?: string;
        temperature?: number;
    }): Promise<string>;
}
