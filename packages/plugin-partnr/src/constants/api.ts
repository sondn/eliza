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
};

export const CHAIN_IDS = {
    BSC: 56,
    ETHEREUM: 1,
} as const;

export const PROTOCOL_IDS = {
    VENUS: "Venus",
    UNISWAP: "Uniswap",
} as const;
