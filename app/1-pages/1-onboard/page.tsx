"use client";

import { SilenceButton } from '@/app/2-widgets/buttons/AccountButton';
import { AddressButton } from '@/app/2-widgets/buttons/AddressButton';
import { SimpleButton } from '@/app/2-widgets/buttons/SimpleButton';
import { useCallback, useState } from 'react';

export default function Onboard() {
    const [isWalletCreated, setIsWalletCreated] = useState(false);

    const handleWalletCreation = useCallback((wallet: any) => {
        if (wallet) {
            setIsWalletCreated(true);
        }
    }, []);

    return (
        <div>
            <h1>Onboard</h1>
            <SilenceButton onWalletCreated={handleWalletCreation} />
            <AddressButton />
            <SimpleButton shouldFetchAddress={isWalletCreated} />
        </div>
    )
}



