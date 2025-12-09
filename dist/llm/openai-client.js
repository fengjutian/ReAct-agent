"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIClient = void 0;
const openai_1 = __importDefault(require("openai"));
class OpenAIClient {
    constructor(apiKey) {
        this.client = new openai_1.default({ apiKey });
    }
    async call(prompt, opts) {
        const model = opts?.model || "gpt-4o-mini";
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
exports.OpenAIClient = OpenAIClient;
