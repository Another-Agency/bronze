import _sodium from 'libsodium-wrappers';
import { v4 as uuid } from 'uuid';
import { decMessage } from '../entropy';
import { ErrorCode, SdkError } from '../error';
import {
    getTokenEndpoint,
    refreshTokenEndpoint,
    sendMessage,
} from '../firebaseEndpoints';
import { DistributedKey, PairingData, StorageData } from '../types';
import * as utils from '../utils';

export interface PairingDataInit {
    pairingId: string;
    encPair: _sodium.KeyPair;
    signPair: _sodium.KeyPair;
}

let pairingDataInit: PairingDataInit;

export const init = async () => {
    console.log("initPairing in actions/pairing");

    try {
        let pairingId = utils.randomPairingId();
        console.log("pairingId", pairingId);

        await _sodium.ready;
        const encPair = _sodium.crypto_box_keypair();
        const signPair = _sodium.crypto_sign_keypair();
        console.log("encPair", encPair);

        pairingDataInit = {
            pairingId,
            encPair,
            signPair,
        };

        let qrCode = JSON.stringify({
            pairingId,
            webEncPublicKey: _sodium.to_hex(encPair.publicKey),
            signPublicKey: _sodium.to_hex(signPair.publicKey),
        });
        console.log("qrCode pairing init", qrCode);

        return qrCode;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else throw new SdkError('unkown-error', ErrorCode.UnknownError);
    }
};

export const getToken = async () => {
    console.log("getToken in actions/pairing");

    try {
        if (!pairingDataInit) {
            throw new SdkError(
                'Pairing data not initialized',
                ErrorCode.PairingNotInitialized,
            );
        }

        let startTime = Date.now();
        console.log("startTime", startTime);

        const signature = _sodium.crypto_sign_detached(
            pairingDataInit.pairingId,
            pairingDataInit.signPair.privateKey,
        );
        console.log("signature", signature);

        const data = await getTokenEndpoint(
            pairingDataInit.pairingId,
            _sodium.to_hex(signature),
        );
        console.log("data", data);

        let tempDistributedKey: DistributedKey | null = null;
        let usedBackupData = false;
        if (data.backupData) {
            try {
                const decreptedMessage = await decMessage(data.backupData);
                tempDistributedKey = JSON.parse(
                    utils.uint8ArrayToUtf8String(decreptedMessage),
                );
                await sendMessage(
                    data.token,
                    'pairing',
                    { isPaired: true },
                    false,
                    pairingDataInit.pairingId,
                );
                usedBackupData = true;
            } catch (error) {
                await sendMessage(
                    data.token,
                    'pairing',
                    { isPaired: false },
                    false,
                    pairingDataInit.pairingId,
                );
                if (error instanceof SdkError) {
                    throw error;
                } else if (error instanceof Error) {
                    throw new SdkError(
                        error.message,
                        ErrorCode.InvalidBackupData,
                    );
                } else
                    throw new SdkError(
                        'unknown-error',
                        ErrorCode.UnknownError,
                    );
            }
        } else {
            await sendMessage(
                data.token,
                'pairing',
                { isPaired: true },
                false,
                pairingDataInit.pairingId,
            );
        }
        console.log("tempDistributedKey", tempDistributedKey);

        const pairingData: PairingData = {
            pairingId: pairingDataInit.pairingId,
            webEncPublicKey: _sodium.to_hex(pairingDataInit.encPair.publicKey),
            webEncPrivateKey: _sodium.to_hex(
                pairingDataInit.encPair.privateKey,
            ),
            webSignPublicKey: _sodium.to_hex(
                pairingDataInit.signPair.publicKey,
            ),
            webSignPrivateKey: _sodium.to_hex(
                pairingDataInit.signPair.privateKey,
            ),
            appPublicKey: data.appPublicKey,
            token: data.token,
            tokenExpiration: data.tokenExpiration,
            deviceName: data.deviceName,
        };
        console.log("getToken pairingData", pairingData);

        return {
            silentShareStorage: {
                pairingData,
                wallets: {},
                requests: {},
                tempDistributedKey,
                accountId: tempDistributedKey ? uuid() : null,
            } as StorageData,
            elapsedTime: Date.now() - startTime,
            deviceName: data.deviceName,
            usedBackupData,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else throw new SdkError('unkown-error', ErrorCode.UnknownError);
    }
};

export const refreshToken = async (pairingData: PairingData) => {
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
