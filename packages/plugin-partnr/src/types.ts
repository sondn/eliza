// types.ts
import { z } from "zod";

// Base configuration types
export interface PartnrConfig {
    apiKey?: string;
    secretKey?: string;
    baseURL?: string;
}

// TODO: Validate data
export const CreateVaultSchema = z.object({
    name: z.string().min(1, { message: "Vault name is required." }),
    symbol: z.string().min(1, { message: "Vault symbol is required." }).toUpperCase(),
    logo: z.string().min(1, { message: "Vault logo is required." }),
    description: z.string().min(1, { message: "Vault description is required." }),
    // chainId: z.string().min(1, { message: "ChainID name is required." }),
    // tokenId: z.string().min(1, { message: "TokenID is required." }),
    //contractAddress: z.string().min(1).toUpperCase(),
});

// Inferred types from schemas
export type CreateVaultRequest = z.infer<typeof CreateVaultSchema>;

// Error handling types
export class PartnrError extends Error {
    constructor(
        message: string,
        public code?: number,
        public details?: unknown
    ) {
        super(message);
        this.name = "PartnrError";
    }
}