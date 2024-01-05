import { SilentWallet } from '@/app/4-entities/srcMpc/model/functionalWallet';

const INIT_CONFIG = {
    rpcUrl: "https://api.stackup.sh/v1/node/88b9386910e64c14fd00cb2342c5e4a8f78b9789b5e7c592e64b2dbe3442e633",
    paymaster: {
        rpcUrl: "https://api.stackup.sh/v1/paymaster/88b9386910e64c14fd00cb2342c5e4a8f78b9789b5e7c592e64b2dbe3442e633",
        context: {},
    },
};

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

        const wallet = new SilentWallet(
            data.result.address,
            data.result.publicKey,
            data.result.p1KeyShare,
            data.result.keygenResult
        );
        console.log("SB wallet", wallet);

        const config = await fetch("/4-entities/srcMpc/api/writeConfig", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...INIT_CONFIG, ...wallet }, null, 2),
        });
        console.log("SB writeConfig Response", config);

        return wallet;

    } catch (error) {
        console.error("createWallet error", error);
        return;
    }
}