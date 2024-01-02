import { v4 as uuidv4 } from 'uuid';
import { initPairing } from "../../lib/sdk";

// In-memory store
const store: { [key: string]: any } = {};

export async function GET(req: Request, res: Response) {
    try {

        const { qrCode, pairingDataInit } = await initPairing();
        console.log("Route qrCodeData", qrCode);

        const id = uuidv4();
        console.log("Route qrCodeData id", id);

        store[id] = pairingDataInit;
        console.log("Route qrCodeData store", store);

        return Response.json({ message: "qrCodeData and pairingData", qrCode, id }, { status: 200 })

    } catch (e) {
        console.error(e);
        return Response.json({ message: "wallet not created", e }, { status: 500 })
    }
}