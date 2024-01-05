'use client'

import { SilentWallet } from '@/app/4-entities/srcMpc/model/functionalWallet';
import { useEffect, useState } from 'react';

export function AddressButton() {
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        const fetchAddress = async () => {
            const walletData = localStorage.getItem('wallet');
            if (walletData) {
                const walletObj = JSON.parse(walletData);
                const wallet = new SilentWallet(
                    walletObj.address,
                    walletObj.public_key,
                    walletObj.p1KeyShare,
                    walletObj.keygenResult
                );
                const address = await wallet.getAddress();
                setAddress(address);
            }
        };
        fetchAddress();
    }, []);

    return (
        <button onClick={() => console.log(address)}>
            Show Address
        </button>
    );
}