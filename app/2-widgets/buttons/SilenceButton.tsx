"use client"
import { SdkError } from '@/app/4-entities/srcMpc/lib/error';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

export function SilenceButton() {
    const [qrCode, setQrCode] = useState<string | null>(null);

    async function createWallet() {
        try {
            const response = await fetch("/4-entities/srcMpc/api/createWallet");
            console.log("SilenceButton response", response);

            const data = await response.json();
            console.log("SilenceButton data", data);
            setQrCode(data.qrCode);

            console.log("SilenceButton qrCode", data.qrCode);
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
    }, [qrCode]);

    return (
        <>
            <button onClick={createWallet}>Create Wallet</button>
            {qrCode && <QRCode value={qrCode} />}
        </>
    );
}