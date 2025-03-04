export const ERROR_CODES = {
    INVALID_CREDENTIALS: 401,
    INVALID_PARAMETERS: 400,
} as const;

export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS:
        "Invalid API credentials. Please check your API key and secret.",
    INVALID_PARAMETERS: "Invalid parameters",
} as const;

export const VALIDATION_ERRORS = {
    MISSING_SECRET_KEY: "PARTNR_SECRET_KEY is required but not configured",
} as const;
