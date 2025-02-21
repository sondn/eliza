/**
 * Create Vault request parameters
 */
export interface CreateVaultRequest {
    name: string;
    webhookUrl: string;
    token: TokenAddress;
    chainId: number;
    tokenAddress: string;
    protocolIds: string[];
}

/**
 * Create Vault response data
 */
export interface CreateVaultResponse {
    message?: string;
    statusCode?: number;
    success?: boolean;
    vault?: Vault;
}