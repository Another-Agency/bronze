

// export interface WalletConfig {
//     wallet: {
//         address: string;
//         publicKey: string;
//         p1KeyShare: string;
//         keygenResult: any;
//         provider: any;
//         getAddress: () => Promise<string>;
//         signMessage: (message: string) => Promise<string>;
//         signTransaction: (transaction: TransactionRequest) => Promise<string>;
//         connect: (provider: Provider) => Promise<any>; // Adjust this line
//         _signTypedData: (domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>) => Promise<string>;
//     };
//     config: typeof INIT_CONFIG;
// }