"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * Ollama LLM client implementation
 * Uses the REST API provided by locally deployed Ollama
 */
class OllamaClient {
    /**
     * Creates a new Ollama client
     * @param opts Optional configuration for the Ollama client
     */
    constructor(opts) {
        this.baseURL = opts?.baseURL || "http://localhost:11434";
        this.defaultModel = opts?.defaultModel || "llama3";
    }
    /**
     * Calls the Ollama API with a prompt
     * @param prompt The prompt to send to the LLM
     * @param opts Optional parameters for the LLM call
     * @returns The LLM's response as a string
     */
    async call(prompt, opts) {
        const model = opts?.model || this.defaultModel;
        const temperature = opts?.temperature ?? 0.2;
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseURL}/api/generate`, {
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
            return data.response || "";
        }
        catch (error) {
            console.error("Ollama client error:", error);
            throw new Error(`Failed to call Ollama: ${error.message}`);
        }
    }
}
exports.OllamaClient = OllamaClient;
