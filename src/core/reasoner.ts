import { LLMClient } from "./types";

export class Reasoner {
  constructor(private llm: LLMClient) {}

  buildPrompt(userQuery: string, history: string[]): string {
    const historyText = history.map(h => `- ${h}`).join("\n");
    return `你是一个遵循 ReAct 框架的智能体。\n历史:\n${historyText}\n用户问题: ${userQuery}\n请按如下格式输出：\nThought: ...\nAction: <action name 或 none>\nAction Input: JSON\nFinal Answer: 只有在完成时输出。`;
  }

  async think(userQuery: string, history: string[]): Promise<string> {
    const prompt = this.buildPrompt(userQuery, history);
    return this.llm.call(prompt);
  }
}
