import { Reasoner } from "./reasoner";
import { parseReAct } from "./parser";
import { Tools } from "../tools";
import { HistoryItem } from "./types";

export class Agent {
  private history: HistoryItem[] = [];
  private textHistory: string[] = [];

  /**
   * 创建一个新的智能体实例
   * @param reasoner 负责思考/逻辑的推理器组件
   * @param maxSteps 允许的最大推理步骤数（默认：8）
   */
  constructor(private reasoner: Reasoner, private maxSteps = 8) {}

  /**
   * 获取当前的交互历史记录
   * @returns 历史记录项数组
   */
  getHistory() {
    return this.history;
  }

  /**
   * 运行智能体通过多个推理步骤处理用户查询
   * @param userQuery 用户的查询/输入
   * @returns 包含最终答案和完整历史记录的对象
   */
  async run(userQuery: string): Promise<{ final: string; history: HistoryItem[] }> {
    // 为新查询重置历史记录
    this.history = [];
    this.textHistory = [];

    // 通过多个推理步骤处理查询
    for (let step = 0; step < this.maxSteps; step++) {
      // 获取这一步的LLM思考过程
      const llmOut = await this.reasoner.think(userQuery, this.textHistory);
      
      // 将智能体的响应添加到历史记录
      this.history.push({ role: "agent", content: llmOut });
      this.textHistory.push(`Agent: ${llmOut}`);

      // 解析LLM输出来确定下一步动作
      const parsed = parseReAct(llmOut);

      // 如果有最终答案，返回它
      if (parsed.finalAnswer) {
        this.history.push({ role: "agent", content: `Final Answer: ${parsed.finalAnswer}` });
        return { final: parsed.finalAnswer, history: this.history };
      }

      // 如果没有指定动作，返回思考内容作为回退
      if (!parsed.action || parsed.action === "none") {
        const fallback = parsed.thought ?? "No action and no final answer.";
        return { final: fallback, history: this.history };
      }

      // 执行指定的工具/动作
      const toolName = parsed.action as keyof typeof Tools;
      const toolFn = (Tools as any)[toolName];
      let observation = "";
      
      try {
        // 使用提供的输入执行工具
        observation = await toolFn(parsed.actionInput?.query ?? parsed.actionInput ?? "");
      } catch (e: any) {
        // 处理工具执行错误
        observation = `Tool error: ${e?.message ?? e}`;
      }

      // 将工具观察结果添加到历史记录
      this.history.push({ role: "tool", content: observation, meta: { action: parsed.action, input: parsed.actionInput } });
      this.textHistory.push(`Observation: ${observation}`);
    }

    // 达到最大步骤数但没有最终答案时返回
    return { final: "Max steps reached without final answer", history: this.history };
  }
}