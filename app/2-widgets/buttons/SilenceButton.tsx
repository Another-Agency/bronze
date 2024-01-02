"use client"
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
            console.log("SilenceButton response", response);

            const data = await response.json();
            console.log("SilenceButton data", data);

            // Convert the object to a JSON string
            const encPairPublicKey = JSON.stringify(data.pairingDataInit.encPair.publicKey);
            const encPairPrivateKey = JSON.stringify(data.pairingDataInit.encPair.privateKey);
            const signPairPublicKey = JSON.stringify(data.pairingDataInit.signPair.publicKey);
            const signPairPrivateKey = JSON.stringify(data.pairingDataInit.signPair.privateKey);

            // Replace the object with the JSON string in the pairingDataInit object
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
            console.log("SilenceButton pairingDataInitSerialized", pairingDataInitSerialized);

            setQrCode(data.qrCode);
            console.log("SilenceButton qrCode", data.qrCode);

            setPairingData(pairingDataInitSerialized);
            console.log("SilenceButton pairingData", pairingDataInitSerialized);

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
            // Retrieve  saveData and automatically pass it to the handleQrCodeScanned function
            runPairing();

        }
    }, [qrCode]);


    async function runPairing() {
        try {
            const response = await fetch("/4-entities/srcMpc/api/runPairing", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scanned: true, pairingDataInit: pairingData }),
            });
            console.log("SB Run Pairing Response", response);
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

    return (
        <>
            <button onClick={getQrCode}>Create Wallet</button>
            {qrCode && <QRCode value={qrCode} />}

            {qrCode && (
                <button onClick={getQrCode}>
                    I've Scanned the QR Code
                </button>
            )}
        </>
    );
}