/**
 * Binance service configuration
 */
export interface PartnrConfig {
    baseURL: string;
    evmPrivateKey?: string;
    solanaPrivateKey?: string;
    timeout?: number;
}

/**
 * Service options that can be passed to any service method
 */
export interface ServiceOptions {
    timeout?: number;
    recvWindow?: number;
}