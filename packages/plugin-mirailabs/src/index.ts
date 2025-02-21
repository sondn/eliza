import type { Plugin } from "@elizaos/core";
import { timeAction } from "./actions/timeAction";

export const samplePlugin: Plugin = {
    name: "samplePlugin",
    description: "A sample plugin that provides time-related actions",
    actions: [timeAction],
    providers: [],
    evaluators: [],
    services: [],
    clients: [],
};
