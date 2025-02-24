import {
    type ActionExample,
    composeContext,
    elizaLogger,
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

const createVaultTemplate = `
Extract the following details to create a new Vault:
- **name** (string): Name of the Vault
- **description** (string): Description of the resource

Provide the values in the following JSON format:

\`\`\`json
{
    "name": "<vault_name>"
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
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
            runtime.getSetting("PARTNR_API_KEY") &&
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
            const context = composeContext({
                state: state,
                template: createVaultTemplate,
            });

            // var content = await generateObjectDeprecated({
            //     runtime,
            //     context,
            //     modelClass: ModelClass.SMALL,
            // });

            const vaultDetails = await generateObject({
                runtime,
                context,
                modelClass: ModelClass.SMALL,
                schema: CreateVaultSchema,
            });

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
                    text: `Successfully create vault with - Name: ${vaultDetails.object.name}`,
                }, []);
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error executing EXECUTE_CREATE_VAULT:", {
                content,
                message: error.message,
                code: error.code,
            });
            if (callback) {
                callback({
                    text: `Error executing EXECUTE_CREATE_VAULT: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create a new Vault with the name 'Vault1'",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Successfully create vault with - Name: Vault1`,
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create a new Vault with the name 'Vault2'",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: `Successfully create vault with - Name: Vault2`,
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
