import { initPairing } from "../../lib/sdk";

// In-memory store

export async function GET(req: Request, res: Response) {
    try {

        const { qrCode, pairingDataInit } = await initPairing();
        console.log("Route qrCodeData", qrCode);

        return Response.json({ message: "qrCodeData and pairingData", qrCode, pairingDataInit }, { status: 200 })

    } catch (e) {
        console.error(e);
        return Response.json({ message: "wallet not created", e }, { status: 500 })
    }
}