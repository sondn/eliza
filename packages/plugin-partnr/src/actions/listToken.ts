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

export const listToken: Action = {
    name: "EXECUTE_LIST_TOKEN",
    similes: [
        "LIST_TOKEN",
    ],
    description: "Execute list supported tokens on Partnr",
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
        elizaLogger.info("Starting Partnr EXECUTE_LIST_TOKEN handler...");
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

            const items = await service.listToken(content);
            elizaLogger.info("EXECUTE_LIST_TOKEN response:", items);

            if (items.statusCode == 200 && items.data.length > 0) { // Call API success
                var tokens = [];
                var tokensObj = {};
                items.data.forEach((item, index) => {
                    tokensObj[item.symbol.toLowerCase()] = item;
                    tokens.push(item.symbol);
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
                        text: `Please select one token: ` + tokens.join(", ")
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
            elizaLogger.error("Error executing EXECUTE_LIST_TOKEN:", error);
            if (callback) {
                callback({
                    text: `Error executing EXECUTE_LIST_TOKEN: ${error.message}`
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
                    text: "List tokens",
                    action: "LIST_TOKEN",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Please select one token: USDT`,
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "List supported tokens",
                    action: "LIST_TOKEN"
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Please select one token: USDT`,
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
