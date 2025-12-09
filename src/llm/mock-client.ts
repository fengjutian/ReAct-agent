import { LLMClient } from "../core/types";

export class MockLLMClient implements LLMClient {
  async call(prompt: string): Promise<string> {
    // 简单策略：如果提示中含有 search 则让模型返回一个 search action；否则直接 final answer。
    if (/search|检查|检索|查找/i.test(prompt)) {
      return `Thought: 需要检索信息\nAction: search\nAction Input: {"query": "最新 AI 技术 2025"}`;
    }

    if (/生成代码|generate code|write code/i.test(prompt)) {
      return `Thought: 生成代码\nFinal Answer: // generated code mock`;
    }

    return `Thought: 我已完成推理\nFinal Answer: (mock) 完成：这是示例响应`;
  }
}
