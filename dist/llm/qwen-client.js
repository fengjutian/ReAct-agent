"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QwenClient = void 0;
const openai_1 = __importDefault(require("openai"));
/**
 * Qwen LLM client implementation
 * Uses the OpenAI-compatible API provided by Alibaba Cloud
 * Qwen is a large AI model developed by Alibaba Cloud
 */
class QwenClient {
    /**
     * Creates a new Qwen client
     * @param apiKey The Qwen API key from Alibaba Cloud
     */
    constructor(apiKey) {
        this.client = new openai_1.default({
            apiKey,
            baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
        });
    }
    /**
     * Calls the Qwen API with a prompt
     * @param prompt The prompt to send to the LLM
     * @param opts Optional parameters for the LLM call
     * @returns The LLM's response as a string
     */
    async call(prompt, opts) {
        const model = opts?.model || "qwen-plus";
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
exports.QwenClient = QwenClient;
