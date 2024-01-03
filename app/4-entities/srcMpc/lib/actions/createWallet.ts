import { SilenceWallet } from '@/app/4-entities/srcMpc/model/functionalWallet';

export async function createWallet(pairingData: any) {
    try {
        const response = await fetch("/4-entities/srcMpc/api/runPairing", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scanned: true, pairingDataInit: pairingData }),
        });
        console.log("SB Pairing Response", response);

        const data = await response.json();
        console.log("SB Pairing Data", data);

        const wallet = SilenceWallet({
            address: data.result.address,
            publicKey: data.result.publicKey,
            p1KeyShare: data.result.p1KeyShare,
            keygenResult: data.result.keygenResult
        });
        console.log("SB wallet", wallet);

        return wallet;

    } catch (error) {
        console.error("createWallet error", error);
        return;
    }
}