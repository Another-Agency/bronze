// "use client"

// // app/2-widgets/buttons/SimpleButton.tsx
// import { SilentWallet } from "@/app/4-entities/srcMpc/model/functionalWallet";
// import config from "@/config.json";
// import { useEffect, useState } from 'react';
// import { Presets } from "userop";

// export function SimpleButton() {
//     const [address, setAddress] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchAddress = async () => {
//             const simpleAccount = await Presets.Builder.SimpleAccount.init(
//                 new SilentWallet(config.address, config.public_key, config.p1KeyShare, config.keygenResult),
//                 config.rpcUrl
//             );
//             const address = await simpleAccount.getSender();
//             setAddress(address);
//         };
//         fetchAddress();
//     }, []);

//     return (
//         <div>
//             <button onClick={() => console.log(address)}>
//                 Show Address
//             </button>
//             {address && <p>Your address: {address}</p>}
//         </div>
//     );
// }