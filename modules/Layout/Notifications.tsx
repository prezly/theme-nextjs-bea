import { Notification } from '@prezly/sdk';

interface Props {
    notifications: Notification[];
}

export default function Notifications({ notifications }: Props) {
    return <>{notifications.map(({ title }) => title).join(' :: ')}</> // FIXME
}
