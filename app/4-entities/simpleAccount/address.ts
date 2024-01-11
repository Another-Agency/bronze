// app/4-entities/simpleAccount/address.ts
import { Presets } from "userop";
// @ts-ignore
import { SilentWallet } from "@/app/4-entities/srcMpc/model/functionalWallet";
import config from "@/config.json";

export default async function SimpleAddress(): Promise<string> {
    const simpleAccount = await Presets.Builder.SimpleAccount.init(
        new SilentWallet(config.address, config.public_key, config.p1KeyShare, config.keygenResult),
        config.rpcUrl
    );
    console.log("Simple Address", simpleAccount);
    const address = await simpleAccount.getSender();

    console.log(`Simple Address: ${address}`);
    return address;
}