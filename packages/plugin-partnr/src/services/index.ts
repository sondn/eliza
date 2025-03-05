import type { PartnrConfig } from "../types/internal/config";
import { CreatorService } from "./creator";
import { ChainService } from "./chain";
import { TokenService } from "./token";
import { Wallet } from "@ethersproject/wallet";
import { toUtf8Bytes } from "@ethersproject/strings";
import { API_DEFAULTS, API_ENDPOINTS } from "../constants/api";
import axios from "axios";


/**
 * Main service facade that coordinates between specialized services
 */
export class PartnrService {
    private config: PartnrConfig;
    private creatorService: CreatorService;
    private chainService: ChainService;
    private tokenService: TokenService;

    private wallet;
    private accessToken;

    constructor(config?: PartnrConfig) {
        this.config = {
            baseURL: API_DEFAULTS.BASE_URL,
            timeout: API_DEFAULTS.TIMEOUT,
            ...config,
        };

        this.creatorService = new CreatorService(config);
        this.chainService = new ChainService(config);
        this.tokenService = new TokenService(config);
        if (config.evmPrivateKey) {
            this.wallet = new Wallet(config.evmPrivateKey);
            console.log("Wallet Address:", this.wallet.address);
            //Call AuthService to get accessToken
            this.authGetChallengeCode().then(challengeCode => {
                console.log(challengeCode);
                return this.authGenerateSignature(challengeCode);
            }).then(data => {
                return this.authLogin(data);
            }).then(accessToken => {
                if (accessToken){
                    this.accessToken = accessToken;
                }
            });
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
    async authGetChallengeCode() {
        console.log(this.config, this.config.baseURL + `${API_ENDPOINTS.AUTH_GET_CHALLENGE}` + this.wallet.address);
        const response = await axios.get(
            this.config.baseURL + `${API_ENDPOINTS.AUTH_GET_CHALLENGE}` + this.wallet.address,
            {
                headers: {
                    accept: "application/json",
                },
            }
        );
        console.log(response.data);
        return response.data.data.challengeCode;
    }

    async authGenerateSignature(challengeCode) {
        try {
            const signature = await this.wallet.signMessage(toUtf8Bytes(challengeCode));
            return {challengeCode, signature};
          } catch (error) {
            console.error("Error signing message:", error);
            return false;
          }
    }

    async authLogin(data) {
        if (data.challengeCode != undefined && data.signature != undefined) {
            var params = {
                challengeCode: data.challengeCode,
                signature: data.signature,
                address: this.wallet.address,
            };

            const response = await axios.post(
                this.config.baseURL + `${API_ENDPOINTS.AUTH_LOGIN}`,
                params,
                {
                    headers: {
                        accept: "application/json",
                    },
                }
            );
            console.log(response.data);
            return response.data.data.accessToken;
        }
        return false;
    }

}
