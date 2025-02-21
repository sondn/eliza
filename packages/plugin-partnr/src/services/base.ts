import { elizaLogger } from "@elizaos/core";
import { API_DEFAULTS } from "../constants/api";
import { ERROR_MESSAGES } from "../constants/errors";
import type { PartnrConfig, ServiceOptions } from "../types/internal/config";
import {
    ApiError,
    AuthenticationError,
    PartnrError,
} from "../types/internal/error";

interface PartnrApiError {
    success?: boolean;
    statusCode?: number;
    message?: string;
    response?: {
        status?: number;
        data?: {
            code?: number;
            msg?: string;
        };
    };
}

/**
 * Base service class with common functionality
 */
export abstract class BaseService {
    protected config: PartnrConfig;

    constructor(config?: PartnrConfig) {
        this.config = {
            baseURL: API_DEFAULTS.BASE_URL,
            timeout: API_DEFAULTS.TIMEOUT,
            ...config,
        };
    }

    /**
     * Handles common error scenarios and transforms them into appropriate error types
     */
    protected handleError(error: unknown, context?: string): never {
        if (error instanceof PartnrError) {
            throw error;
        }

        const apiError = error as PartnrApiError;
        const errorStatusCode = apiError.statusCode;
        const errorMessage = apiError.message;
        const errorResponse = apiError.response?.data;

        // Handle authentication errors
        if (apiError.statusCode && apiError.statusCode == 401) {
            throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
        // Log unexpected errors for debugging
        elizaLogger.error("Unexpected API error:", {
            context,
            code: errorStatusCode,
            message: errorMessage,
        });

        throw new ApiError(
            errorMessage || "An unexpected error occurred",
            errorStatusCode || 500,
            errorResponse
        );
    }

    /**
     * Validates required API credentials
     */
    protected validateCredentials(): void {
        if (!this.config.apiKey || !this.config.secretKey) {
            throw new AuthenticationError("API credentials are required");
        }
    }

    /**
     * Merges default options with provided options
     */
    protected mergeOptions(options?: ServiceOptions): ServiceOptions {
        return {
            timeout: this.config.timeout,
            ...options,
        };
    }
}
