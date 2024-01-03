import { getToken } from "@/app/4-entities/srcMpc/lib/actions/tokengen";
import { runKeygen } from "@/app/4-entities/srcMpc/lib/runKeygen";
import { IP1KeyShare } from "@silencelaboratories/ecdsa-tss";
import { ethers } from "ethers";
import { getPairingDataInit } from "../../lib/pairingDataHelper";
import { saveSilentShareStorage } from "../../lib/storage";


export async function POST(req: Request, res: Response) {
    console.log("Run Pairing POST", req.body);
    try {
        if (!req.body) {
            throw new Error("Request body is null");
        }
        const body = await req.json();
        const pairingData = body.pairingDataInit;

        const pairingDataInit = getPairingDataInit(pairingData);

        const result = await getToken(pairingDataInit);
        console.log("Route runPairing", result);

        await saveSilentShareStorage(result.silentShareStorage);
        console.log("Route runPairing result.silentShareStorage", result.silentShareStorage);

        const keygenResult = await runKeygen();
        console.log("Route runPairing keygenResult", keygenResult);

        const p1KeyShare: IP1KeyShare = keygenResult.distributedKey.keyShareData;
        if (!p1KeyShare) {
            throw new Error("Failed to generate p1KeyShare");
        }
        console.log("Route runPairing p1KeyShare", p1KeyShare);

        const publicKey = p1KeyShare.public_key;
        console.log("Route runPairing publicKey", publicKey);

        const address = ethers.utils.computeAddress(`0x04${publicKey}`);
        console.log("Route runPairing address", address);

        return Response.json({
            message: "runPairing",
            result: {
                address,
                publicKey: p1KeyShare.public_key,
                p1KeyShare,
                keygenResult
            }
        }, { status: 200 })
    } catch (e) {
        console.error(e);
        return Response.json({ message: "wallet not created", e }, { status: 500 })
    }
}