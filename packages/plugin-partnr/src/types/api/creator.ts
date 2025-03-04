/**
 * Create Vault request parameters
 */
export interface CreateVaultRequest {
    name: string;
    symbol: string;
    logo: string;
    description: string;
    tokenId: string;
    chainId: string;
    contractAddress: string;
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