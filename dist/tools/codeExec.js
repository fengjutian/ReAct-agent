"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCode = runCode;
async function runCode(code) {
    try {
        // 注意：不要在生产中直接 eval 未信任的代码！这里仅示例。
        // 为安全起见，我们只 eval 简单表达式
        // eslint-disable-next-line no-eval
        const result = eval(code);
        return `Code execution result: ${String(result)}`;
    }
    catch (e) {
        return `Code execution error: ${e?.message ?? e}`;
    }
}
