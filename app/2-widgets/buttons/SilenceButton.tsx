"use client"
import { createWallet } from '@/app/4-entities/srcMpc/lib/actions/createWallet';
import { SdkError } from '@/app/4-entities/srcMpc/lib/error';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

export function SilenceButton() {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [pairingData, setPairingData] = useState<{
        pairingId: any;
        encPair: { publicKey: string; privateKey: string };
        signPair: { publicKey: string; privateKey: string };
    } | null>(null);

    async function getQrCode() {
        try {
            const response = await fetch("/4-entities/srcMpc/api/qrCodePairing");
            const data = await response.json();

            // Convert the object to a JSON string so we can send it back to the server
            const encPairPublicKey = JSON.stringify(data.pairingDataInit.encPair.publicKey);
            const encPairPrivateKey = JSON.stringify(data.pairingDataInit.encPair.privateKey);
            const signPairPublicKey = JSON.stringify(data.pairingDataInit.signPair.publicKey);
            const signPairPrivateKey = JSON.stringify(data.pairingDataInit.signPair.privateKey);

            const pairingDataInitSerialized = {
                pairingId: data.pairingDataInit.pairingId,
                encPair: {
                    publicKey: encPairPublicKey,
                    privateKey: encPairPrivateKey,
                },
                signPair: {
                    publicKey: signPairPublicKey,
                    privateKey: signPairPrivateKey,
                },
            };

            setQrCode(data.qrCode);
            setPairingData(pairingDataInitSerialized);

        } catch (error) {
            if (error instanceof SdkError) {
                // Handle SdkError instances differently
                console.error("SilenceButton SdkError", error.message);
            } else {
                console.error("SilenceButton error", error);
            }
            return;
        }
    }

    useEffect(() => {
        console.log("qrCode state", qrCode);
        if (qrCode) {
            createWallet(pairingData);
        }
    }, [qrCode]);

    return (
        <>
            <button onClick={getQrCode}>Create Wallet</button>
            {qrCode && <QRCode value={qrCode} />}

        </>
    );
}