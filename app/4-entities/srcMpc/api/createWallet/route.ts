
// const INIT_CONFIG = {
//     rpcUrl:
//         "https://api.stackup.sh/v1/node/88b9386910e64c14fd00cb2342c5e4a8f78b9789b5e7c592e64b2dbe3442e633",
//     paymaster: {
//         rpcUrl:
//             "https://api.stackup.sh/v1/paymaster/88b9386910e64c14fd00cb2342c5e4a8f78b9789b5e7c592e64b2dbe3442e633",
//         context: {},
//     },
// };
// const CONFIG_PATH = path.resolve(process.cwd(), "./app/4-entities/config.json");
// console.log("createWallet Route", CONFIG_PATH);

// // Now lets create the wallet
// async function createWallet() {
//     console.log("createWallet Function")

//     const wallet = await SilentWallet.generate();
//     console.log("wallet created", wallet);

//     return fs.writeFile(
//         CONFIG_PATH,
//         await prettier.format(JSON.stringify({ ...INIT_CONFIG, ...wallet }, null, 2), {
//             parser: "json",
//         })
//     );
// }



export async function POST(req: Request, res: Response) {
    try {
        // Extract relevant data from the request, e.g., a token or identifier
        const { scanned, wallet } = await req.json();

        if (scanned) {
            // Resume the wallet creation process
            const wallet = await resumeWalletCreation(wallet);
            console.log(`Wallet created: ${wallet}`);

            // Respond with the wallet information or a success message
            return Response.json({ message: "Wallet successfully created", wallet }, { status: 201 });
        } else {
            // Handle the case where the QR code has not been scanned
            return Response.json({ message: "QR code not scanned" }, { status: 400 });
        }
    } catch (e) {
        console.error(e);
        return Response.json({ message: "Error creating wallet", e }, { status: 500 });
    }
}