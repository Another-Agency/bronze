import _sodium from 'libsodium-wrappers';
import { ErrorCode, SdkError } from "../error";
import { refreshTokenEndpoint } from "../firebaseEndpoints";
import { PairingData } from "../types";


export const RefreshToken = async (pairingData: PairingData) => {
    try {
        let startTime = Date.now();
        let signature: Uint8Array;
        signature = _sodium.crypto_sign_detached(
            pairingData.token,
            _sodium.from_hex(pairingData.webSignPrivateKey),
        );

        const data = await refreshTokenEndpoint(
            pairingData.token,
            _sodium.to_hex(signature),
        );
        const newPairingData: PairingData = {
            ...pairingData,
            ...data,
        };
        return {
            newPairingData: newPairingData,
            elapsedTime: Date.now() - startTime,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else throw new SdkError(`unkown-error`, ErrorCode.UnknownError);
    }
};