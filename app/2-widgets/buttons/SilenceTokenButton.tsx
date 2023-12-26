import { getTokenEndpoint } from "@/app/4-entities/srcMpc/api/firebase/route";

type SilenceTokenButtonProps = {
    pairingId: string;
    signature: string;
};

export function SilenceTokenButton({ pairingId, signature }: SilenceTokenButtonProps) {
    const handleClick = async () => {
        await getTokenEndpoint(pairingId, signature);
    };

    return (
        <button onClick={handleClick}>Silence Token</button>
    );
} 