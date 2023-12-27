"use client"

export function SilenceButton() {
    const createWallet = async () => {
        const response = await fetch("/4-entities/srcMpc/api/createWallet");
        const data = await response.json();
        console.log("SilenceButton", data.message);
        window.location.reload();
    };

    return (
        <button onClick={createWallet}>Create Wallet</button>
    );
}