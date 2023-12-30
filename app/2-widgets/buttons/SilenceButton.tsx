"use client"
import { SdkError } from '@/app/4-entities/srcMpc/lib/error';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

export function SilenceButton() {
    const [qrCode, setQrCode] = useState<string | null>(null);

    async function createWallet() {
        try {
            const response = await fetch("/4-entities/srcMpc/api/qrCodeGen");
            console.log("SilenceButton response", response);

            const data = await response.json();
            console.log("SilenceButton data", data);

            setQrCode(data.qrCodeData);
            console.log("SilenceButton qrCode", data.qrCodeData);

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
            // Automatically call handleQrCodeScanned when qrCode is set
            handleQrCodeScanned();
        }
    }, [qrCode]);

    async function handleQrCodeScanned() {
        try {
            const response = await fetch("/4-entities/srcMpc/api/createWallet", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scanned: true }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Wallet creation response", data);
            // Handle the response, e.g., show a success message or navigate to another page
        } catch (error) {
            console.error("Error notifying wallet creation", error);
        }
    }

    return (
        <>
            <button onClick={createWallet}>Create Wallet</button>
            {qrCode && <QRCode value={qrCode} />}

            {qrCode && (
                <button onClick={handleQrCodeScanned}>
                    I've Scanned the QR Code
                </button>
            )}
        </>
    );
}