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
}



const createVaultTemplate = `

{{recentMessages}}

Given the recent messages, extract the following information about the requested vault creation:

- Vault name
- Vault symbol
- Vault logo
- Vault description

User need provide full informations with vault name, logo, symbol and description. If not, ask them for missing informations.
Asking user to confirm provided data, and need user confirm before executing action create vault.

Provide the values in the following JSON format:

\`\`\`json
{
    "name": "Vault name",
    "symbol": "Vault symbol",
    "logo": "Vault logo",
    "description": "Vault description"
}
\`\`\`
`;

export const createVault: Action = {
    name: "EXECUTE_CREATE_VAULT",
    similes: [
        "CREATE_VAULT",
        "NEW_VAULT",
    ],
    description: "Execute create new Vault on Partnr",
    validate: async (runtime: IAgentRuntime) => {
        return !!(
            runtime.getSetting("PARTNR_SECRET_KEY")
        );
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: Record<string, unknown>,
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting Partnr EXECUTE_CREATE_VAULT handler...");
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

            // const service = new PartnrService({
            //     apiKey: runtime.getSetting("PARTNR_API_KEY"),
            //     secretKey: runtime.getSetting("PARTNR_SECRET_KEY"),
            // });

            // const createResult = await service.createVault(content);

            // persist relevant data if needed to memory/knowledge
            // const memory = {
            //     type: "vault",
            //     content: vaultDetails.object,
            //     timestamp: new Date().toISOString()
            // };
            // await runtime.storeMemory(memory);

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
