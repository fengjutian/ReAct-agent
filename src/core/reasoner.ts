import { LLMClient } from "./types";

/**
 * Reasoner class responsible for building prompts and generating thoughts
 * using the LLM client based on the ReAct framework
 */
export class Reasoner {
  /**
   * Creates a new Reasoner instance
   * @param llm The LLM client to use for generating responses
   */
  constructor(private llm: LLMClient) {}

  /**
   * Builds a prompt for the LLM based on the user query and conversation history
   * @param userQuery The current user query
   * @param history The conversation history
   * @returns Formatted prompt string for the LLM
   */
  buildPrompt(userQuery: string, history: string[]): string {
    const historyText = history.map(h => `- ${h}`).join("\n");
    return `你是一个遵循 ReAct 框架的智能体。
      历史:
      ${historyText}
      用户问题: ${userQuery}
      请按如下格式输出：
      Thought: ...
      Action: <action name 或 none>
      Action Input: JSON
      Final Answer: 只有在完成时输出。`;
    }

  /**
   * Generates a thought/response from the LLM based on the user query and history
   * @param userQuery The current user query
   * @param history The conversation history
   * @returns The LLM's response
   */
  async think(userQuery: string, history: string[]): Promise<string> {
    const prompt = this.buildPrompt(userQuery, history);
    return this.llm.call(prompt);
  }
}