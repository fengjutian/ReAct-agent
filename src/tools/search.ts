/**
 * Performs a web search for the given query
 * @param query The search query
 * @returns Mock search results (in production, this would connect to a real search API)
 */
export async function webSearch(query: string): Promise<string> {
  // 最小实现：模拟搜索结果。
  // 生产：在这里接入搜索 API（Bing、Google、企业内部搜索）
  return `Search Results (mock): top hits for '${query}'`;
}