import * as PairingAction from "@/app/4-entities/srcMpc/lib/actions/pairing";
import * as SignAction from "@/app/4-entities/srcMpc/lib/actions/sign";
import { ErrorCode, SdkError } from "@/app/4-entities/srcMpc/lib/error";
//import { refreshPairing } from "@/app/4-entities/srcMpc/lib/sdk";
import { fromHexStringToBytes } from "@/app/4-entities/srcMpc/lib/utils";
import { getSilentShareStorage, saveSilentShareStorage } from "../../lib/storage";
import { StorageData } from "../../lib/types";


async function refreshPairing() {
    const silentShareStorage: StorageData = await getSilentShareStorage();
    const pairingData = silentShareStorage.pairingData;
    const result = await PairingAction.refreshToken(pairingData);
    await saveSilentShareStorage({
        ...silentShareStorage,
        pairingData: result.newPairingData,
    });
    return result.newPairingData;
}

export async function POST(req: Request, res: Response) {
    try {
        if (!req.body) {
            throw new Error("Request body is null");
        }

        let { hashAlg, message, messageHashHex, signMetadata, accountId, keyShare } = await req.json();
        if (messageHashHex.startsWith("0x")) {
            messageHashHex = messageHashHex.slice(2);
        }
        if (message.startsWith("0x")) {
            message = message.slice(2);
        }
        const silentShareStorage = await getSilentShareStorage();
        let pairingData = silentShareStorage.pairingData;
        if (pairingData.tokenExpiration < Date.now() - 60000) {
            pairingData = await refreshPairing();
        }

        const messageHash = fromHexStringToBytes(messageHashHex);
        if (messageHash.length !== 32) {
            throw new SdkError(
                "Invalid length of messageHash, should be 32 bytes",
                ErrorCode.InvalidMessageHashLength
            );
        }

        const result = await SignAction.sign(
            pairingData,
            keyShare,
            hashAlg,
            message,
            messageHash,
            signMetadata,
            accountId
        );
        console.log("Route runSign", result);

        return Response.json({ message: "runSign", result }, { status: 200 });
    } catch (e) {
        console.error(e);
        return Response.json({ message: "runSign failed", e }, { status: 500 })
    }
}