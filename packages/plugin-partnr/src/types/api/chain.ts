/**
 * List Chain request parameters
 */
export interface ListChainRequest {
    id?: string;
    chainId?: string;
    chainType?: string;
    name?: string;
    shortName?: string;
    type?: string;
    status?: string;
}

/**
 * List Chain response data
 */
export interface ListChainResponse {
    statusCode: number;
    message: string;
    data?: Chain[];
}