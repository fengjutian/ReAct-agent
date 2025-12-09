import * as search from "./search";
import * as codeExec from "./codeExec";

export const Tools = {
  search: search.webSearch,
  code_exec: codeExec.runCode
} as const;

export type ToolName = keyof typeof Tools;
