import { ERROR_MESSAGES } from "../constants/errors";
import type { CreateVaultRequest, CreateVaultResponse } from "../types/api/creator";
import { BaseService } from "./base";

/**
 * Service for handling creator operations
 */
export class CreatorService extends BaseService {
    /**
     * Create a Vault
     */
    async createVault(request: CreateVaultRequest): Promise<CreateVaultResponse> {
        try {
            // TODO: Call Partnr API and response data
            // this.validateCredentials();
            return {
                success: true,
                message: "OK",
            };
        } catch (error) {
            throw this.handleError(error, request.name);
        }
    }
}
