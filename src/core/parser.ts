import { ReActParsed } from "./types";

/**
 * 解析LLM的ReAct框架响应为结构化数据
 * @param text LLM的原始文本响应
 * @returns 解析后的ReAct对象，包含finalAnswer、thought、action和actionInput
 */
export function parseReAct(text: string): ReActParsed {
  const res: ReActParsed = {};

  // 提取最终答案（如果存在）
  const finalMatch = text.match(/Final Answer\s*:\s*([\s\S]*)$/i);
  if (finalMatch) res.finalAnswer = finalMatch[1].trim();

  // 提取思考内容（如果存在）
  const thoughtMatch = text.match(/Thought\s*:\s*([\s\S]*?)(?:\nAction\s*:|$)/i);
  if (thoughtMatch) res.thought = thoughtMatch[1].trim();

  // 提取动作（如果存在）
  const actionMatch = text.match(/Action\s*:\s*(\w+)/i);
  if (actionMatch) res.action = actionMatch[1] as any;

  // 提取动作输入（如果存在）
  const inputMatch = text.match(/Action Input\s*:\s*([\s\S]*?)(?:\nObservation\s*:|\nThought\s*:|\nFinal Answer\s*:|$)/i);
  if (inputMatch) {
    const raw = inputMatch[1].trim();
    try {
      // 尝试解析为JSON
      res.actionInput = JSON.parse(raw);
    } catch (e) {
      // 如果JSON解析失败，使用纯文本
      res.actionInput = raw;
    }
  }

  return res;
}