import type { PartnrConfig } from "../types/internal/config";
import { CreatorService } from "./creator";
import { ChainService } from "./chain";
import { TokenService } from "./token";
import { Wallet } from "@ethersproject/wallet";


/**
 * Main service facade that coordinates between specialized services
 */
export class PartnrService {
    private creatorService: CreatorService;
    private chainService: ChainService;
    private tokenService: TokenService;

    private wallet;
    private accessToken;

    constructor(config?: PartnrConfig) {
        this.creatorService = new CreatorService(config);
        this.chainService = new ChainService(config);
        this.tokenService = new TokenService(config);
        if (config.evmPrivateKey) {
            this.wallet = new Wallet(config.evmPrivateKey);
            console.log("Wallet Address:", this.wallet.address);
            //TODO: Call AuthService to get accessToken

        }
    }

    /**
     * operations
     */
    async createVault(...args: Parameters<CreatorService["createVault"]>) {
        return this.creatorService.createVault(...args, this.accessToken);
    }

    async listChain(...args: Parameters<ChainService["listChain"]>) {
        return this.chainService.listChain(...args);
    }

    async listToken(...args: Parameters<TokenService["listToken"]>) {
        return this.tokenService.listToken(...args);
    }



    // Auth functions
    async getCode() {
        //return this.creatorService.createVault(...args, this.accessToken);
    }

}

export { CreatorService };
