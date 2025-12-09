"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSearch = webSearch;
async function webSearch(query) {
    // 最小实现：模拟搜索结果。
    // 生产：在这里接入搜索 API（Bing、Google、企业内部搜索）
    return `Search Results (mock): top hits for '${query}'`;
}
