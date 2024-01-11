"use client"

// app/2-widgets/buttons/SimpleButton.tsx
import SimpleAddress from '@/app/4-entities/simpleAccount/address';
import { useEffect, useState } from 'react';

export function SimpleButton({ shouldFetchAddress }: { shouldFetchAddress: boolean }) {
    const [address, setAddress] = useState<string>('');

    useEffect(() => {
        if (shouldFetchAddress) {
            const fetchAddress = async () => {
                const address = await SimpleAddress();
                setAddress(address);
            };

            fetchAddress();
        }
    }, [shouldFetchAddress]);

    return (
        <div>
            <button onClick={() => console.log(`Address: ${address}`)}>
                Click me
            </button>
            {address && <p>Your address: {address}</p>}
        </div>
    );
};