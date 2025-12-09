import { Reasoner } from "./reasoner";
import { HistoryItem } from "./types";
export declare class Agent {
    private reasoner;
    private maxSteps;
    private history;
    private textHistory;
    constructor(reasoner: Reasoner, maxSteps?: number);
    getHistory(): HistoryItem[];
    run(userQuery: string): Promise<{
        final: string;
        history: HistoryItem[];
    }>;
}
