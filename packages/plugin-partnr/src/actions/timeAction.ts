import {
    type Action,
    type ActionExample,
    type IAgentRuntime,
    type Memory,
    type HandlerCallback,
    type State,
    type Handler,
    type Validator,
    type Content,
    // composeContext,
    // generateObject,
    // ModelClass,
    elizaLogger,
} from "@elizaos/core";

const timeHandler: Handler = async (
        runtime: IAgentRuntime,
        _message: Memory,
        state?: State,
        _options?: object,
        callback?: HandlerCallback
    ) => {
            elizaLogger.log("Starting Partnr GET_CURRENT_TIME handler...");
            try {
                const now = new Date();
                const response: Content = {
                    text: `The current time is: ${now.toLocaleTimeString()}`
                };
                if (callback) {
                    return callback(response);
                }
            } catch (error) {
                elizaLogger.error("Error creating resource:", error);
                var responseError = Content({ text: `Failed to create resource. Please check the logs.` });
                callback( responseError );
            }
};


export const timeAction: Action = {
    name: "GET_CURRENT_TIME",
    description: "Returns the current time",
    similes: ["CURRENT_TIME", "NOW", "WHAT_TIME"],
    handler: timeHandler,
    validate: async (runtime, _message) => {
        return true;
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "current time",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "The current time is 2025-02-24 15:00:00GMT+07",
                    action: "GET_CURRENT_TIME"
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "what is current time",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "The current time is 2025-02-24 15:00:00GMT+07",
                    action: "GET_CURRENT_TIME"
                },
            },
        ],
    ] as ActionExample[][]
};
