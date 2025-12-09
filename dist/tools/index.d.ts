import * as search from "./search";
import * as codeExec from "./codeExec";
export declare const Tools: {
    readonly search: typeof search.webSearch;
    readonly code_exec: typeof codeExec.runCode;
};
export type ToolName = keyof typeof Tools;
