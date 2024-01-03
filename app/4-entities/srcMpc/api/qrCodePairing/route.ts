import * as QrCodePairing from "@/app/4-entities/srcMpc/lib/actions/initQrCode";

export async function GET(req: Request, res: Response) {
    try {

        const { qrCode, pairingDataInit } = await QrCodePairing.init();

        return Response.json({ message: "qrCodeData and pairingData", qrCode, pairingDataInit }, { status: 200 })

    } catch (e) {
        console.error(e);
        return Response.json({ message: "wallet not created", e }, { status: 500 })
    }
}