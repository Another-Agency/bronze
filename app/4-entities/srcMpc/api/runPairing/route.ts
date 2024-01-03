import { IP1KeyShare } from "@silencelaboratories/ecdsa-tss";
import { ethers } from "ethers";
import { getToken } from "../../lib/actions/pairing";
import { getPairingDataInit } from "../../lib/pairingDataHelper";
import { runKeygen } from "../../lib/sdk";
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

        const keygenResult = await runKeygen();
        console.log("keygenResult", keygenResult);

        const p1KeyShare: IP1KeyShare = keygenResult.distributedKey.keyShareData;
        if (!p1KeyShare) {
            throw new Error("Failed to generate p1KeyShare");
        }
        console.log("p1KeyShare", p1KeyShare);

        const publicKey = p1KeyShare.public_key;
        console.log("publicKey", publicKey);

        const address = ethers.utils.computeAddress(`0x04${publicKey}`);
        console.log("address", address);

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