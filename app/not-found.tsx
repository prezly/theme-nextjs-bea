import { locale } from '@/theme-kit';

export default function NotFound() {
    return (
        <div>
            <h2>Not Found ({locale().code})</h2>
            <p>Could not find requested resource</p>
        </div>
    );
}
