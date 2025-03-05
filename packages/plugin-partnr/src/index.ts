import type { Plugin } from "@elizaos/core";
import { createVault } from "./actions/createVault";
import { listChain } from "./actions/listChain";
import { listToken } from "./actions/listToken";

export const partnrPlugin: Plugin = {
    name: "partnrPlugin",
    description: "Partnr Plugin for connect to Partnr",
    actions: [createVault, listChain, listToken],
    providers: [],
    evaluators: [],
    services: [],
    clients: [],
};
