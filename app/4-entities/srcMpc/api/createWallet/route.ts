
import { SilentWallet } from "@/app/4-entities/srcMpc/model/simpleWallet";
import fs from "fs/promises";
import path from "path";
import prettier from "prettier";

const INIT_CONFIG = {
    rpcUrl:
        "https://api.stackup.sh/v1/node/88b9386910e64c14fd00cb2342c5e4a8f78b9789b5e7c592e64b2dbe3442e633",
    paymaster: {
        rpcUrl:
            "https://api.stackup.sh/v1/paymaster/88b9386910e64c14fd00cb2342c5e4a8f78b9789b5e7c592e64b2dbe3442e633",
        context: {},
    },
};
const CONFIG_PATH = path.resolve(__dirname, "../config.json");

// Now lets create the wallet
async function createWallet() {
    const wallet = await SilentWallet.generate();

    return fs.writeFile(
        CONFIG_PATH,
        await prettier.format(JSON.stringify({ ...INIT_CONFIG, ...wallet }, null, 2), {
            parser: "json",
        })
    );
}

export async function GET(req: Request, res: Response) {
    try {
        await createWallet();
        console.log(`Config written to ${CONFIG_PATH}`);
        console.log("wallet created", createWallet);

        return Response.json({ message: "wallet created" }, { status: 200 })
    } catch (e) {
        console.error(e);
    }
}


