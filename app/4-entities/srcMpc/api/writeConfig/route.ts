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

export async function POST(req: Request, res: Response) {
    try {
        if (!req.body) {
            throw new Error("Request body is null");
        }
        const configData = await req.json();
        const CONFIG_PATH = path.join(process.cwd(), 'config.json');
        console.log("CONFIG_PATH", CONFIG_PATH);
        console.log("configData", configData);

        await fs.writeFile(
            CONFIG_PATH,
            await prettier.format(
                JSON.stringify({ ...INIT_CONFIG, ...configData }, null, 2),
                { parser: "json" }
            )
        );

        return Response.json({ message: "config response" }, { status: 200 });
    } catch (e) {
        console.error(e);
        return Response.json({ message: "config not written", e }, { status: 500 })
    }

}