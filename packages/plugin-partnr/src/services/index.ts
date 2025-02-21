import type { PartnrConfig } from "../types/internal/config";
import { CreatorService } from "./creator";

/**
 * Main service facade that coordinates between specialized services
 */
export class PartnrService {
    private creatorService: CreatorService;

    constructor(config?: PartnrConfig) {
        this.creatorService = new CreatorService(config);
    }

    /**
     * Trading operations
     */
    async createVault(...args: Parameters<CreatorService["createVault"]>) {
        return this.creatorService.createVault(...args);
    }

}

export { CreatorService };
