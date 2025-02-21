/**
 * Binance service configuration
 */
export interface PartnrConfig {
    apiKey?: string;
    secretKey?: string;
    baseURL?: string;
    timeout?: number;
}

/**
 * Service options that can be passed to any service method
 */
export interface ServiceOptions {
    timeout?: number;
    recvWindow?: number;
}