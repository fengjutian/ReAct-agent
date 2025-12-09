import { Reasoner } from "./reasoner";
import { parseReAct } from "./parser";
import { Tools } from "../tools";
import { HistoryItem } from "./types";

export class Agent {
  private history: HistoryItem[] = [];
  private textHistory: string[] = [];

  constructor(private reasoner: Reasoner, private maxSteps = 8) {}

  getHistory() {
    return this.history;
  }

  async run(userQuery: string): Promise<{ final: string; history: HistoryItem[] }> {
    this.history = [];
    this.textHistory = [];

    for (let step = 0; step < this.maxSteps; step++) {
      const llmOut = await this.reasoner.think(userQuery, this.textHistory);
      this.history.push({ role: "agent", content: llmOut });
      this.textHistory.push(`Agent: ${llmOut}`);

      const parsed = parseReAct(llmOut);

      if (parsed.finalAnswer) {
        this.history.push({ role: "agent", content: `Final Answer: ${parsed.finalAnswer}` });
        return { final: parsed.finalAnswer, history: this.history };
      }

      if (!parsed.action || parsed.action === "none") {
        const fallback = parsed.thought ?? "No action and no final answer.";
        return { final: fallback, history: this.history };
      }

      // 执行工具
      const toolName = parsed.action as keyof typeof Tools;
      const toolFn = (Tools as any)[toolName];
      let observation = "";
      try {
        observation = await toolFn(parsed.actionInput?.query ?? parsed.actionInput ?? "");
      } catch (e: any) {
        observation = `Tool error: ${e?.message ?? e}`;
      }

      this.history.push({ role: "tool", content: observation, meta: { action: parsed.action, input: parsed.actionInput } });
      this.textHistory.push(`Observation: ${observation}`);
    }

    return { final: "Max steps reached without final answer", history: this.history };
  }
}
