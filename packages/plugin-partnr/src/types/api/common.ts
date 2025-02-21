export interface TokenAddress {
    tokenId: string;
    symbol: string;
    name: string;
    image: string;
    address: string;
    decimals: number;
}
export interface Creator {
    address: string;
    chainType: "EVM" | "NON_EVM";
    name: string;
}

export interface Chain {
    id: string;
    name: string;
    image: string;
    explorer: string;
    chainType: "EVM" | "NON_EVM";
}

export interface Protocol {
    id: string;
    name: string;
    image: string;
}

export interface Vault {
    id: string;
    name: string;
    creator: Creator;
    token: TokenAddress;
    chain: Chain;
    poolAddress: string;
    protocols: Protocol[];
    tvl: string;
    apy: number;
    totalEarned: string;
    ageDays: number;
    totalDeposits: string;
    totalWithdrawals: string;
    totalUsers: string;
}