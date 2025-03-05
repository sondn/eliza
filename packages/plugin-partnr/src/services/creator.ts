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
    async createVault(request: CreateVaultRequest, accessToken: string): Promise<CreateVaultResponse> {
        try {
            const response = await axios.post(
                this.config.baseURL + `${API_ENDPOINTS.CREATE_VAULT}`,
                request,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: "Bearer " + accessToken
                    },
                }
            );
            console.log(request, response);
            return response.data;
        } catch (error) {
            throw this.handleError(error, request.name);
        }
    }
}
