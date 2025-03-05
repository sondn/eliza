export interface TokenAddress {
    id: string;
    name: string;
    symbol: string;
    address: string;
    logo: string;
    decimals: number;
    chainId: string;
    protocol: string;
    assetId: string;
    createdAt: string;
}
export interface Creator {
    address: string;
    chainType: "EVM" | "SOLANA" | "APTOS" | "TON";
    name: string;
}

export interface Currency {
    name: string;
    symbol: string;
    decimals: number;
}
export interface Chain {
    id: string;
    chainId: number;
    chainType: "EVM" | "SOLANA" | "APTOS" | "TON";
    name: string;
    shortName: string;
    logo: string;
    rpc: string[];
    tokenStandard: string;
    durableBlockConfirmations: number;
    type: "mainnet" | "testnet";
    nativeCurrency: Currency;
    explorers: string[];
    defaultEnableNative: boolean;
    skipDefaultGasForNative: boolean;
    status: number;
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

export interface DepositRule {
    min: number;
    max: number;
}

export interface WithdrawTerm {
    lockUpPeriod: number;
    delay: number;
}

export interface Fee {
    performanceFee: number;
    recipientAddress: number;
}

export interface DepositInit {
    networkId: string;
    amountDeposit: number;
}