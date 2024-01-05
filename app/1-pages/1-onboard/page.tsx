import { SilenceButton } from '@/app/2-widgets/buttons/AccountButton'
import { AddressButton } from '@/app/2-widgets/buttons/AddressButton'
//import { SimpleButton } from '@/app/2-widgets/buttons/SimpleButton'

export default function Onboard() {
    return (
        <div>
            <h1>Onboard</h1>
            <SilenceButton />
            <AddressButton />
            {/* <SimpleButton /> */}
        </div>
    )
}

