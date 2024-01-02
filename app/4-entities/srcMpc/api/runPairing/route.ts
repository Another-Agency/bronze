import _sodium from "libsodium-wrappers";
import { getToken } from "../../lib/actions/pairing";

type PairingRequest = {
    body: {
        pairdingId: string;
        encPair: _sodium.KeyPair;
        signPair: _sodium.KeyPair;
    }
}
const store: { [key: string]: any } = {};

export async function POST(req: Request, res: Response) {
    console.log("Run Pairing POST", req.body);
    try {
        if (!req.body) {
            throw new Error("Request body is null");
        }
        const body = await req.json();
        const id = body.id;
        console.log("Route runPairing id", id);

        const pairingDataInit = store[id];
        console.log("Route runPairing pairingDataInit", pairingDataInit);

        const result = await getToken(pairingDataInit);
        console.log("Route runPairing", result);

        return Response.json({ message: "runPairing", result }, { status: 200 })
    } catch (e) {
        console.error(e);
        return Response.json({ message: "wallet not created", e }, { status: 500 })
    }
}