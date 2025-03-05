/**
 * List Token request parameters
 */
export interface ListTokenRequest {
    id?: string;
    name?: string;
    symbol?: string;
    address?: string;
    chainId?: string;
    protocol?: string;
    status?: string;
    assetId?: string;
}

/**
 * List Token response data
 */
export interface ListTokenResponse {
    statusCode: number;
    message: string;
    data?: TokenAddress[];
}