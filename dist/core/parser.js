"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReAct = parseReAct;
function parseReAct(text) {
    const res = {};
    const finalMatch = text.match(/Final Answer\s*:\s*([\s\S]*)$/i);
    if (finalMatch)
        res.finalAnswer = finalMatch[1].trim();
    const thoughtMatch = text.match(/Thought\s*:\s*([\s\S]*?)(?:\nAction\s*:|$)/i);
    if (thoughtMatch)
        res.thought = thoughtMatch[1].trim();
    const actionMatch = text.match(/Action\s*:\s*(\w+)/i);
    if (actionMatch)
        res.action = actionMatch[1];
    const inputMatch = text.match(/Action Input\s*:\s*([\s\S]*?)(?:\nObservation\s*:|\nThought\s*:|\nFinal Answer\s*:|$)/i);
    if (inputMatch) {
        const raw = inputMatch[1].trim();
        try {
            res.actionInput = JSON.parse(raw);
        }
        catch (e) {
            res.actionInput = raw;
        }
    }
    return res;
}
