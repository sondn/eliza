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

const createVaultTemplate = `Look at your LAST RESPONSE in the conversation where you confirmed a create vault request.
Based on ONLY that last message, extract the trading details:

Create Vault must include USDT or BUSD or USDC. For example:
- For "create vault SOL and USDC" -> use pool "SOL-USDC" as name
- For "create vault ETH and USDC" -> use pool "ETH-USDC" as name
- For "create vault BNB and USDC" -> use pool "BNB-USDC" as name

\`\`\`json
{
    "name": "<pair with stable coin>",
    "tokenAddress": "<token address from your last response>"
}
\`\`\`

Recent conversation:
{{recentMessages}}`;

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
        let content;
        try {
            let currentState = state;
            if (!currentState) {
                currentState = await runtime.composeState(message);
            } else {
                currentState = await runtime.updateRecentMessageState(currentState);
            }

            const context = composeContext({
                state: currentState,
                template: createVaultTemplate,
            });

            content = await generateObjectDeprecated({
                runtime,
                context,
                modelClass: ModelClass.SMALL,
            });

            // Convert quantity to number if it's a string
            if (content && typeof content.quantity === "string") {
                content.quantity = Number.parseFloat(content.quantity);
            }

            const parseResult = CreateVaultSchema.safeParse(content);
            if (!parseResult.success) {
                throw new Error(
                    `Invalid create vault content: ${JSON.stringify(parseResult.error.errors, null, 2)}`
                );
            }

            const service = new PartnrService({
                apiKey: runtime.getSetting("PARTNR_API_KEY"),
                secretKey: runtime.getSetting("PARTNR_SECRET_KEY"),
            });

            const createResult = await service.createVault(content);

            if (callback) {
                callback({
                    text: `Successfully create vault with message: ${createResult.message}`,
                    content: createResult,
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error executing trade:", {
                content,
                message: error.message,
                code: error.code,
            });
            if (callback) {
                callback({
                    text: `Error executing trade: ${error.message}`,
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
                    text: "Create vault with USDC pair",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "What chain you want for create new Vault?",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "BSC",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "What tokenAddress to create vault with USDC token?",
                },
            },
            {
                user: "{{user1}}",
                content: {
                    text: "0x96Be0FBbfb126063Eb27bea4F34E096fa661fC9e",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll execute a create vault HINAGI-USDC pair, HINAGI from address 0x96Be0FBbfb126063Eb27bea4F34E096fa661fC9e",
                    action: "EXECUTE_CREATE_VAULT",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Successfully create vault with message: OK",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
