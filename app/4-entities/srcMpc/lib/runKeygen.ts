import { randBytes } from "@silencelaboratories/ecdsa-tss";
import { v4 as uuid } from "uuid";
import * as KeyGenAction from "./actions/keygen";
import { refreshPairing } from "./sdk";
import { getSilentShareStorage, saveSilentShareStorage } from "./storage";
import { StorageData } from "./types";

export async function runKeygen() {
    const silentShareStorage: StorageData = await getSilentShareStorage();
    let pairingData = silentShareStorage.pairingData;
    // Refresh token if it is expired
    if (pairingData.tokenExpiration < Date.now() - 600000) {
        pairingData = await refreshPairing();
    }
    const wallets = silentShareStorage.wallets;
    const accountId = Object.keys(wallets).length + 1;
    const x1 = await randBytes(32);
    const result = await KeyGenAction.keygen(pairingData, accountId, x1);
    saveSilentShareStorage({
        ...silentShareStorage,
        accountId: uuid(),
        tempDistributedKey: {
            publicKey: result.publicKey,
            accountId,
            keyShareData: result.keyShareData,
        },
    });
    return {
        distributedKey: {
            publicKey: result.publicKey,
            accountId: accountId,
            keyShareData: result.keyShareData,
        },
        elapsedTime: result.elapsedTime,
    };
}
