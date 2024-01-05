import { ErrorCode, SdkError } from "@/app/4-entities/srcMpc/lib/error";
import { runSign } from "@/app/4-entities/srcMpc/lib/sdk";
import { fromHexStringToBytes } from "@/app/4-entities/srcMpc/lib/utils";

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
        const messageHash = fromHexStringToBytes(messageHashHex);
        if (messageHash.length !== 32) {
            throw new SdkError(
                "Invalid length of messageHash, should be 32 bytes",
                ErrorCode.InvalidMessageHashLength
            );
        }

        const result = await runSign(hashAlg, message, messageHashHex, signMetadata, accountId, keyShare);
        console.log("Route runSign", result);

        return Response.json({ message: "runSign", result }, { status: 200 });
    } catch (e) {
        console.error(e);
        return Response.json({ message: "runSign failed", e }, { status: 500 })
    }
}