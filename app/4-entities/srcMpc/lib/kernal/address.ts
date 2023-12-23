import { Presets } from "userop";
// @ts-ignore
import { SilentWallet } from "@/app/4-entities/silentWallet";
import config from "@/app/4-entities/srcMpc/config.json";

export default async function main() {
    const kernel = await Presets.Builder.Kernel.init(
        new SilentWallet(config.address, config.public_key, config.p1KeyShare, config.keygenResult),

        config.rpcUrl
    );
    const address = kernel.getSender();

    console.log(`Kernel address: ${address}`);
}
