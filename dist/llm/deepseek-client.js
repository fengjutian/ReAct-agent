"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeepSeekClient = void 0;
const openai_1 = __importDefault(require("openai"));
/**
 * DeepSeek LLM client implementation
 * Uses the OpenAI-compatible API provided by DeepSeek
 * DeepSeek is a large AI model developed by DeepSeek Inc.
 */
class DeepSeekClient {
    /**
     * Creates a new DeepSeek client
     * @param apiKey The DeepSeek API key from DeepSeek Inc.
     */
    constructor(apiKey) {
        this.client = new openai_1.default({
            apiKey,
            baseURL: "https://api.deepseek.com/v1"
        });
    }
    /**
     * Calls the DeepSeek API with a prompt
     * @param prompt The prompt to send to the LLM
     * @param opts Optional parameters for the LLM call
     * @returns The LLM's response as a string
     */
    async call(prompt, opts) {
        const model = opts?.model || "deepseek-chat";
        const resp = await this.client.chat.completions.create({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: opts?.temperature ?? 0.2,
            max_tokens: 800
        });
        const text = resp.choices?.[0]?.message?.content ?? JSON.stringify(resp);
        return String(text);
    }
}
exports.DeepSeekClient = DeepSeekClient;
