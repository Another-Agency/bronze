import { SilentWallet } from "@/app/4-entities/srcMpc/model/cliWallet";
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

async function main() {
    // performKeygen()

    const silentSigner = await SilentWallet.generate();

    return fs.writeFile(
        CONFIG_PATH,
        await prettier.format(
            JSON.stringify({ ...INIT_CONFIG, ...silentSigner }, null, 2),
            { parser: "json" }
        )
    );
}

main()
    .then(() => console.log(`Config written to ${CONFIG_PATH}`))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
