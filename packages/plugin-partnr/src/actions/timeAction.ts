import {
    type Action,
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


const timeValidate: Validator = async(_runtime: IAgentRuntime, message: Memory, _state?: State) => {
    
    return true;
    //return message.text.toLowerCase().includes("time");
};
const timeHandler: Handler = async (
        runtime: IAgentRuntime,
        _message: Memory,
        state?: State,
        _options?: object,
        callback?: HandlerCallback
    ) => {
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
                // var responseContent = Content({ text: `Failed to create resource. Please check the logs.` });
                // callback( responseContent, [] );
            }
};


export const timeAction: Action = {
    name: "getTime",
    description: "Returns the current time",
    similes: ["current time", "now", "what time is it"],
    examples: [],
    handler: timeHandler,
    validate: timeValidate,
};
