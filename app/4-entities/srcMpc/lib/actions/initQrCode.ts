
import _sodium from 'libsodium-wrappers';
import { ErrorCode, SdkError } from "../error";
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

        await _sodium.ready;
        const encPair = _sodium.crypto_box_keypair();
        const signPair = _sodium.crypto_sign_keypair();

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

        return { qrCode, pairingDataInit };
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else throw new SdkError('unkown-error', ErrorCode.UnknownError);
    }
};