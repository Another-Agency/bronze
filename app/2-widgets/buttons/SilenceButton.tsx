"use client"
import { SdkError } from '@/app/4-entities/srcMpc/lib/error';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

export function SilenceButton() {
    const [qrCode, setQrCode] = useState<string | null>(null);
    //const [pairingData, setPairingData] = useState<string | null>(null);
    const [storageId, setStorageId] = useState<string | null>(null);

    async function getQrCode() {
        try {
            const response = await fetch("/4-entities/srcMpc/api/qrCodePairing");
            console.log("SilenceButton response", response);

            const data = await response.json();
            console.log("SilenceButton data", data);

            setQrCode(data.qrCode);
            console.log("SilenceButton qrCode", data.qrCode);

            // setPairingData(data.pairingDataInit);
            // console.log("SilenceButton pairingData", data.pairingDataInit);

            setStorageId(data.id);
            console.log("SilenceButton storage", data.id);

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
                body: JSON.stringify({ scanned: true, id: storageId }),
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