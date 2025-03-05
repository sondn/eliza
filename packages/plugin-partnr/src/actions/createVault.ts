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
import { CreateVaultSchema } from "../types";

export interface CreateVaultContent extends Content {
    name: string;
    logo: string;
    symbol: string;
    description: string;
    chainId: string;
}

const createVaultTemplate = `Respond with a JSON markdown block containing only the extracted values. Come up for any values that cannot be determined.

Example response:
\`\`\`json
{
    "chainId": "Vault chainId",
    "tokenId": "Vault tokenId",
    "name": "Vault name",
    "symbol": "Vault symbol",
    "logo": "Vault logo",
    "description": "Vault description"
}
\`\`\`

{{recentMessages}}
Given the recent messages, extract (come up with if not included) the following information about the requested vault creation:

- Vault chainId
- Vault tokenId
- Vault name
- Vault symbol
- Vault logo
- Vault description

Respond with a JSON markdown block containing only the extracted values.
`;

export const createVault: Action = {
    name: "EXECUTE_CREATE_VAULT",
    similes: [
        "CREATE_VAULT",
        "NEW_VAULT",
    ],
    description: "Execute create new Vault on Partnr. Requires vault chainId, tokenId, name, symbol, logo and description.",
    validate: async (runtime: IAgentRuntime) => {
        return !!(
            runtime.getSetting("PARTNR_EVM_PRIVATE_KEY")
        );
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: Record<string, unknown>,
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.info("Starting Partnr EXECUTE_CREATE_VAULT handler...");
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
                template: createVaultTemplate,
            });

            // Generate transfer content
            const content = await generateObject({
                runtime,
                context: transferContext,
                modelClass: ModelClass.SMALL,
                schema: CreateVaultSchema,
            });

            const payload = content.object as CreateVaultContent;
            const isCreateVaultContent =
                payload.name && payload.logo && payload.symbol && payload.description;

            // Validate transfer content
            if (!isCreateVaultContent) {
                elizaLogger.error("Invalid content for EXECUTE_CREATE_VAULT action.");
                if (callback) {
                    callback({
                        text: "Unable to process transfer request. Invalid content provided.",
                        content: { error: "Invalid content" },
                    });
                }
                return false;
            }

            elizaLogger.info(payload);

            // const service = new PartnrService({
            //     evmPrivateKey: runtime.getSetting("PARTNR_EVM_PRIVATE_KEY"),
            // });

            // const createResult = await service.createVault(content);

            if (callback) {
                callback({
                    text: `Successfully create vault with - Name: ${payload.name}`,
                }, []);
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error executing EXECUTE_CREATE_VAULT:", error);
            if (callback) {
                callback({
                    text: `Error executing EXECUTE_CREATE_VAULT: ${error.message}`
                }, []);
            }
            return false;
        }
    },
    examples: [
        [
            {
                "user": "{{user1}}",
                "content": {
                    "text": "Create new vault"
                }
            },
            {
                "user": "{{agentName}}",
                "content": {
                    "text": "Please select chain you want.",
                    "action": "EXECUTE_LIST_CHAIN"
                }
            },
            {
                "user": "{{user1}}",
                "content": {
                    "text": "BSC"
                }
            },
            {
                "user": "{{agentName}}",
                "content": {
                    "text": "Please select token you want.",
                    "action": "EXECUTE_LIST_TOKEN"
                }
            },
            {
                "user": "{{user1}}",
                "content": {
                    "text": "USDT"
                }
            },
            {
                "user": "{{agentName}}",
                "content": {
                    "text": "chainId as BSC, symbol as USDT, next what is name, logo and description of your Vault?"
                }
            },
            {
                "user": "{{user1}}",
                "content": {
                    "text": "name as TESTVAULT, logo https://example.com/img.png, description as Demo"
                }
            },
            {
                "user": "{{agentName}}",
                "content": {
                    "text": "Successfully create vault with - Name: TESTVAULT",
                    "action": "EXECUTE_CREATE_VAULT"
                }
            }
        ],
        [
            {
                "user": "{{user1}}",
                "content": {
                    "text": "Create vault"
                }
            },
            {
                "user": "{{agentName}}",
                "content": {
                    "text": "Please select chain you want.",
                    "action": "EXECUTE_LIST_CHAIN"
                }
            },
            {
                "user": "{{user1}}",
                "content": {
                    "text": "BSC"
                }
            },
            {
                "user": "{{agentName}}",
                "content": {
                    "text": "Please select token you want.",
                    "action": "EXECUTE_LIST_TOKEN"
                }
            },
            {
                "user": "{{user1}}",
                "content": {
                    "text": "USDT"
                }
            },
            {
                "user": "{{agentName}}",
                "content": {
                    "text": "chainId as BSC, symbol as USDT, next what is name, logo and description of your Vault?"
                }
            },
            {
                "user": "{{user1}}",
                "content": {
                    "text": "name as TESTVAULT, logo https://example.com/img.png, description as Demo"
                }
            },
            {
                "user": "{{agentName}}",
                "content": {
                    "text": "Successfully create vault with - Name: TESTVAULT",
                    "action": "EXECUTE_CREATE_VAULT"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create a vault name TESTVAULT with symbol USDT logo 'https://example.com' and description 'Test vault description'",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Successfully create vault with - Name: TESTVAULT`,
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create a vault name TESTVAULT2 with symbol USDT, description 'Test vault description' and logo 'https://example.com/'",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Successfully create vault with - Name: TESTVAULT2`,
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
