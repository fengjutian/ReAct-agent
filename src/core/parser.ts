import { ReActParsed } from "./types";

/**
 * Parses the ReAct framework response from the LLM into structured data
 * @param text The raw text response from the LLM
 * @returns Parsed ReAct object containing finalAnswer, thought, action, and actionInput
 */
export function parseReAct(text: string): ReActParsed {
  const res: ReActParsed = {};

  // Extract final answer if present
  const finalMatch = text.match(/Final Answer\s*:\s*([\s\S]*)$/i);
  if (finalMatch) res.finalAnswer = finalMatch[1].trim();

  // Extract thought if present
  const thoughtMatch = text.match(/Thought\s*:\s*([\s\S]*?)(?:\nAction\s*:|$)/i);
  if (thoughtMatch) res.thought = thoughtMatch[1].trim();

  // Extract action if present
  const actionMatch = text.match(/Action\s*:\s*(\w+)/i);
  if (actionMatch) res.action = actionMatch[1] as any;

  // Extract action input if present
  const inputMatch = text.match(/Action Input\s*:\s*([\s\S]*?)(?:\nObservation\s*:|\nThought\s*:|\nFinal Answer\s*:|$)/i);
  if (inputMatch) {
    const raw = inputMatch[1].trim();
    try {
      // Try to parse as JSON
      res.actionInput = JSON.parse(raw);
    } catch (e) {
      // If JSON parsing fails, use as plain text
      res.actionInput = raw;
    }
  }

  return res;
}