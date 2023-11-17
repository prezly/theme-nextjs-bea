import { Boilerplate } from '@/modules/Boilerplate';
import { Footer } from '@/modules/Footer';
import { SubscribeForm } from '@/modules/SubscribeForm';

export default function FooterSlot() {
    return (
        <>
            <SubscribeForm />
            <Boilerplate />
            <Footer />
        </>
    );
}
