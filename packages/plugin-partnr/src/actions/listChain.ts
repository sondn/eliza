import {
    type ActionExample,
    composeContext,
    elizaLogger,
    generateObject,
    generateObjectDeprecated,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
    type Action,
} from "@elizaos/core";
import { PartnrService } from "../services";
import { ListChainSchema } from "../types";

export const listChain: Action = {
    name: "EXECUTE_LIST_CHAIN",
    similes: [
        "LIST_CHAIN",
    ],
    description: "Execute list supported chains on Partnr",
    validate: async (runtime: IAgentRuntime) => {
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: Record<string, unknown>,
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.info("Starting Partnr EXECUTE_LIST_CHAIN handler...");
        try {
            // Initialize or update state
            let currentState: State;
            if (!state) {
                currentState = (await runtime.composeState(message)) as State;
            } else {
                currentState = await runtime.updateRecentMessageState(state);
            }

            // Compose transfer context
            const transferContext = composeContext({
                state: currentState,
                template: '{{recentMessages}}',
            });

            // Generate transfer content
            const content = await generateObject({
                runtime,
                context: transferContext,
                modelClass: ModelClass.SMALL,
                schema: ListChainSchema,
            });

            const service = new PartnrService({
                evmPrivateKey: runtime.getSetting("PARTNR_EVM_PRIVATE_KEY"),
            });

            const items = await service.listChain(content);
            elizaLogger.info("EXECUTE_LIST_CHAIN response:", items);

            if (items.statusCode == 200 && items.data.length > 0) { // Call API success
                var chains = [];
                var chainsObj = {};
                items.data.forEach((item, index) => {
                    chainsObj[item.name.toLowerCase()] = item;
                    chains.push(item.name);
                });
                // Save chainsObj to memory
                // persist relevant data if needed to memory/knowledge
                // const memory = {
                //     type: "chains",
                //     content: chainsObj,
                //     timestamp: new Date().toISOString()
                // };

                // await runtime.storeMemory(memory);
                if (callback) {
                    callback({
                        text: `Please select one chain: ` + chains.join(", ")
                    }, []);
                }
            } else {
                if (callback) {
                    callback({
                        text: `No chain currently supported, please come back later!`
                    }, []);
                }
            }
            return true;
        } catch (error) {
            elizaLogger.error("Error executing EXECUTE_LIST_CHAIN:", error);
            if (callback) {
                callback({
                    text: `Error executing EXECUTE_LIST_CHAIN: ${error.message}`
                }, []);
            }
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "List supported chains",
                    action: "LIST_CHAIN",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Successfully list chains`,
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "List chains",
                    action: "LIST_CHAIN"
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Successfully list chains`,
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
