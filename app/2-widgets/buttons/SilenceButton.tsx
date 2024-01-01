"use client"
import { SdkError } from '@/app/4-entities/srcMpc/lib/error';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

export function SilenceButton() {
    const [qrCode, setQrCode] = useState<string | null>(null);

    async function getQrCode() {
        try {
            const response = await fetch("/4-entities/srcMpc/api/qrCodeGen");
            console.log("SilenceButton response", response);

            const data = await response.json();
            console.log("SilenceButton data", data);

            //save the data in the state
            // const saveData = await saveSilentShareStorage(data);
            // console.log("SilenceButton saveData", saveData);

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
            // Retrieve  saveData and automatically pass it to the handleQrCodeScanned function
            createWallet();

        }
    }, [qrCode]);

    async function createWallet() {
        try {
            const response = await fetch("/4-entities/srcMpc/api/createWallet", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scanned: true, wallet: qrCode }),
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
            <button onClick={getQrCode}>Create Wallet</button>
            {qrCode && <QRCode value={qrCode} />}

            {qrCode && (
                <button onClick={createWallet}>
                    I've Scanned the QR Code
                </button>
            )}
        </>
    );
}