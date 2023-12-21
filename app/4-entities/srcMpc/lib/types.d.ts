
export interface BackupConversation {
    createdAt: number;
    expiry: number;
    backupData: string;
    isBackedUp: boolean | null;
    pairingId: string;
}

export interface DistributedKey {
    accountId: number;
    publicKey: string;
    keyShareData: IP1KeyShare;
}

export interface SignConversation {
    createdAt: number;
    expiry: number;
    isApproved: boolean | null;
    accountId: number;
    hashAlg: string;
    signMessage: string;
    messageHash: string;
    signMetadata: SignMetadata;
    publicKey: string;
    sessionId: string;
    message: Message;
}

export type SignMetadata =
    | "legacy_transaction"
    | "eth_transaction"
    | "eth_sign"
    | "personal_sign"
    | "eth_signTypedData"
    | "eth_signTypedData_v1"
    | "eth_signTypedData_v2"
    | "eth_signTypedData_v3"
    | "eth_signTypedData_v4";

export interface KeygenConversation {
    createdAt: number;
    expiry: number;
    isApproved: boolean | null;
    accountId: number;
    sessionId: string;
    message: Message;
}

export interface PairingData {
    pairingId: string;
    webEncPublicKey: string;
    webEncPrivateKey: string;
    webSignPublicKey: string;
    webSignPrivateKey: string;
    token: string;
    tokenExpiration: number;
    appPublicKey: string;
    deviceName: string;
}

export type StorageData = KeyringState & {
    pairingData: PairingData;
    accountId: string | null;
    tempDistributedKey: DistributedKey | null;
};