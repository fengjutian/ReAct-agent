import { Reasoner } from "./reasoner";
import { parseReAct } from "./parser";
import { Tools } from "../tools";
import { HistoryItem } from "./types";

export class Agent {
  private history: HistoryItem[] = [];
  private textHistory: string[] = [];

  /**
   * Creates a new Agent instance
   * @param reasoner The reasoner component responsible for thinking/logic
   * @param maxSteps Maximum number of reasoning steps allowed (default: 8)
   */
  constructor(private reasoner: Reasoner, private maxSteps = 8) {}

  /**
   * Gets the current history of interactions
   * @returns Array of history items
   */
  getHistory() {
    return this.history;
  }

  /**
   * Runs the agent to process a user query through multiple reasoning steps
   * @param userQuery The query/input from the user
   * @returns Object containing the final answer and complete history
   */
  async run(userQuery: string): Promise<{ final: string; history: HistoryItem[] }> {
    // Reset history for new query
    this.history = [];
    this.textHistory = [];

    // Process the query through multiple reasoning steps
    for (let step = 0; step < this.maxSteps; step++) {
      // Get the LLM's thought process for this step
      const llmOut = await this.reasoner.think(userQuery, this.textHistory);
      
      // Add the agent's response to history
      this.history.push({ role: "agent", content: llmOut });
      this.textHistory.push(`Agent: ${llmOut}`);

      // Parse the LLM output to determine next action
      const parsed = parseReAct(llmOut);

      // If we have a final answer, return it
      if (parsed.finalAnswer) {
        this.history.push({ role: "agent", content: `Final Answer: ${parsed.finalAnswer}` });
        return { final: parsed.finalAnswer, history: this.history };
      }

      // If no action is specified, return the thought as fallback
      if (!parsed.action || parsed.action === "none") {
        const fallback = parsed.thought ?? "No action and no final answer.";
        return { final: fallback, history: this.history };
      }

      // Execute the specified tool/action
      const toolName = parsed.action as keyof typeof Tools;
      const toolFn = (Tools as any)[toolName];
      let observation = "";
      
      try {
        // Execute the tool with the provided input
        observation = await toolFn(parsed.actionInput?.query ?? parsed.actionInput ?? "");
      } catch (e: any) {
        // Handle tool execution errors
        observation = `Tool error: ${e?.message ?? e}`;
      }

      // Add tool observation to history
      this.history.push({ role: "tool", content: observation, meta: { action: parsed.action, input: parsed.actionInput } });
      this.textHistory.push(`Observation: ${observation}`);
    }

    // Return when maximum steps reached without final answer
    return { final: "Max steps reached without final answer", history: this.history };
  }
}