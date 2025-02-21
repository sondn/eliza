import { ERROR_CODES } from "../../constants/errors";

type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * Base error class for Binance-related errors
 */
export class PartnrError extends Error {
    public readonly code: ErrorCode | number;
    public readonly originalError?: unknown;

    constructor(
        message: string,
        code: ErrorCode | number = ERROR_CODES.INVALID_PARAMETERS,
        originalError?: unknown
    ) {
        super(message);
        this.name = "PartnrError";
        this.code = code;
        this.originalError = originalError;

        // Maintains proper stack trace for where error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PartnrError);
        }
    }
}

/**
 * Error thrown when API credentials are invalid or missing
 */
export class AuthenticationError extends PartnrError {
    constructor(message = "Invalid API credentials") {
        super(message, ERROR_CODES.INVALID_CREDENTIALS);
        this.name = "AuthenticationError";
    }
}

/**
 * Error thrown when API request fails
 */
export class ApiError extends PartnrError {
    constructor(
        message: string,
        code: number,
        public readonly response?: unknown
    ) {
        super(message, code);
        this.name = "ApiError";
    }
}
