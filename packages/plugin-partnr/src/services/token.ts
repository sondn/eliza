import { ERROR_MESSAGES } from "../constants/errors";
import type { ListTokenRequest, ListTokenResponse } from "../types/api/token";
import { BaseService } from "./base";
import { API_DEFAULTS, API_ENDPOINTS } from "../constants/api";
import axios from "axios";

/**
 * Service for handling token operations
 */
export class TokenService extends BaseService {
    /**
     * List Token
     */
    async listToken(request: ListTokenRequest): Promise<ListTokenResponse> {
        try {
            const response = await axios.get(
                this.config.baseURL + `${API_ENDPOINTS.TOKEN_LIST}`,
                {
                    headers: {
                        accept: "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }
}
