import { ERROR_MESSAGES } from "../constants/errors";
import type { ListChainRequest, ListChainResponse } from "../types/api/chain";
import { BaseService } from "./base";
import { API_DEFAULTS, API_ENDPOINTS } from "../constants/api";
import axios from "axios";

/**
 * Service for handling creator operations
 */
export class ChainService extends BaseService {
    /**
     * Create a Vault
     */
    async listChain(request: ListChainRequest): Promise<ListChainResponse> {
        try {
            const response = await axios.get(
                this.config.baseURL + `${API_ENDPOINTS.CHAIN_LIST}`,
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
