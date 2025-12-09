import * as search from "./search";
import * as codeExec from "./codeExec";

/**
 * Collection of available tools for the agent
 * Maps tool names to their implementation functions
 */
export const Tools = {
  search: search.webSearch,
  code_exec: codeExec.runCode
} as const;

/**
 * Type definition for available tool names
 */
export type ToolName = keyof typeof Tools;