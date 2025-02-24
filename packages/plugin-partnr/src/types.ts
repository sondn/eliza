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
    name: z.string().min(1).toUpperCase(),
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