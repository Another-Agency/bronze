// pairingDataHelper.ts

interface Pair {
    publicKey: string;
    privateKey: string;
    keyType: 'x25519' | 'ed25519';
}

interface PairingData {
    pairingId: string;
    encPair: Pair;
    signPair: Pair;
}

export const toUint8Array = (objString: string): Uint8Array => {
    const obj = JSON.parse(objString);
    const arr = Object.keys(obj).sort((a, b) => parseInt(a) - parseInt(b)).map(key => obj[key]);
    return new Uint8Array(arr);
};

export const getPairingDataInit = (pairingData: PairingData) => {
    const encPairPublicKey = toUint8Array(pairingData.encPair.publicKey);
    const encPairPrivateKey = toUint8Array(pairingData.encPair.privateKey);
    const signPairPublicKey = toUint8Array(pairingData.signPair.publicKey);
    const signPairPrivateKey = toUint8Array(pairingData.signPair.privateKey);

    return {
        pairingId: pairingData.pairingId,
        encPair: {
            publicKey: encPairPublicKey,
            privateKey: encPairPrivateKey,
            keyType: pairingData.encPair.keyType,
        },
        signPair: {
            publicKey: signPairPublicKey,
            privateKey: signPairPrivateKey,
            keyType: pairingData.signPair.keyType,
        },
    };
};