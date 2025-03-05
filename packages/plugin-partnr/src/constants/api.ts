export const API_DEFAULTS = {
    BASE_URL: "https://vault-api-dev.partnr.xyz",
    TIMEOUT: 30000, // 30 seconds
    RATE_LIMIT: {
        MAX_REQUESTS_PER_MINUTE: 1200,
        WEIGHT_PER_REQUEST: 1,
    },
};

export const API_ENDPOINTS = {
    CREATOR_CREATE: "/creator/create",
    CHAIN_LIST: "/api/chain",
    TOKEN_LIST: "/api/token",
};