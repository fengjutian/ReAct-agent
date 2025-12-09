"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const parser_1 = require("./parser");
const tools_1 = require("../tools");
class Agent {
    constructor(reasoner, maxSteps = 8) {
        this.reasoner = reasoner;
        this.maxSteps = maxSteps;
        this.history = [];
        this.textHistory = [];
    }
    getHistory() {
        return this.history;
    }
    async run(userQuery) {
        this.history = [];
        this.textHistory = [];
        for (let step = 0; step < this.maxSteps; step++) {
            const llmOut = await this.reasoner.think(userQuery, this.textHistory);
            this.history.push({ role: "agent", content: llmOut });
            this.textHistory.push(`Agent: ${llmOut}`);
            const parsed = (0, parser_1.parseReAct)(llmOut);
            if (parsed.finalAnswer) {
                this.history.push({ role: "agent", content: `Final Answer: ${parsed.finalAnswer}` });
                return { final: parsed.finalAnswer, history: this.history };
            }
            if (!parsed.action || parsed.action === "none") {
                const fallback = parsed.thought ?? "No action and no final answer.";
                return { final: fallback, history: this.history };
            }
            // 执行工具
            const toolName = parsed.action;
            const toolFn = tools_1.Tools[toolName];
            let observation = "";
            try {
                observation = await toolFn(parsed.actionInput?.query ?? parsed.actionInput ?? "");
            }
            catch (e) {
                observation = `Tool error: ${e?.message ?? e}`;
            }
            this.history.push({ role: "tool", content: observation, meta: { action: parsed.action, input: parsed.actionInput } });
            this.textHistory.push(`Observation: ${observation}`);
        }
        return { final: "Max steps reached without final answer", history: this.history };
    }
}
exports.Agent = Agent;
