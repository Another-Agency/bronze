import { getToken } from "../../lib/actions/pairing";


export async function POST(req: Request, res: Response) {
    console.log("Run Pairing POST", req.body);
    try {
        if (!req.body) {
            throw new Error("Request body is null");
        }
        const body = await req.json();
        const pairingData = body.pairingDataInit;
        console.log("Route pairingData", pairingData);

        // Helper function to convert the stringified object to Uint8Array
        const toUint8Array = (objString: string) => {
            const obj = JSON.parse(objString);
            const arr = Object.keys(obj).sort((a, b) => parseInt(a) - parseInt(b)).map(key => obj[key]);
            return new Uint8Array(arr);
        };

        // Convert the stringified object back to Uint8Array
        const encPairPublicKey = toUint8Array(pairingData.encPair.publicKey);
        const encPairPrivateKey = toUint8Array(pairingData.encPair.privateKey);
        const signPairPublicKey = toUint8Array(pairingData.signPair.publicKey);
        const signPairPrivateKey = toUint8Array(pairingData.signPair.privateKey);

        const pairingDataInit = {
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

        const result = await getToken(pairingDataInit);
        console.log("Route runPairing", result);

        return Response.json({ message: "runPairing", result }, { status: 200 })
    } catch (e) {
        console.error(e);
        return Response.json({ message: "wallet not created", e }, { status: 500 })
    }
}