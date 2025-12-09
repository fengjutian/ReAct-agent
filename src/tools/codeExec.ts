/**
 * Executes code and returns the result
 * @param code The code to execute
 * @returns The result of code execution or an error message
 * 
 * ⚠️ SECURITY WARNING: This is a simplified implementation for demonstration purposes only.
 * Do not use eval() with untrusted code in production environments!
 */
export async function runCode(code: string): Promise<string> {
  try {
    // 注意：不要在生产中直接 eval 未信任的代码！这里仅示例。
    // 为安全起见，我们只 eval 简单表达式
    // eslint-disable-next-line no-eval
    const result = eval(code);
    return `Code execution result: ${String(result)}`;
  } catch (e: any) {
    return `Code execution error: ${e?.message ?? e}`;
  }
}