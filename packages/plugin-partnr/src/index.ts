import type { Plugin } from "@elizaos/core";
import { createVault } from "./actions/createVault";

export const partnrPlugin: Plugin = {
    name: "partnrPlugin",
    description: "Partnr Plugin for connect to Partnr",
    actions: [createVault],
    providers: [],
    evaluators: [],
    services: [],
    clients: [],
};
