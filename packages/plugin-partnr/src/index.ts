import type { Plugin } from "@elizaos/core";
import { timeAction } from "./actions/timeAction";
import { createVault } from "./actions/createVault";

export const partnrPlugin: Plugin = {
    name: "partnrPlugin",
    description: "Partnr Plugin for connect to Partnr",
    actions: [timeAction, createVault],
    providers: [],
    evaluators: [],
    services: [],
    clients: [],
};
