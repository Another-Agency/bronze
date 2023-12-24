// app/routes/api/getToken/route.ts
import { SdkError } from "@/app/4-entities/srcMpc/lib/error";

const baseUrl = "https://us-central1-mobile-wallet-mm-snap.cloudfunctions.net";//import type { NextApiRequest, NextApiResponse } from 'next'

export async function POST(req: Request, res: Response) {
    try {
        const { pairingId, signature } = await req.json();
        const url = baseUrl + `/getToken`;

        const data = {
            token: "token",
            appPublicKey: "appPublicKey",
            deviceName: "deviceName",
            tokenExpiration: 0,
            backupData: "backupData",
        };

        return Response.json({ success: true, data }, { status: 200 })
    } catch (error) {
        console.error(error);
        if (error instanceof SdkError) {
            return Response.json({ error: error.message }, { status: 400 });
        } else {
            return Response.json({ error: "Unknown error" }, { status: 500 });
        }
    }
}
