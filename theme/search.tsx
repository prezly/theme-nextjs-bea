interface Match {
    locale: string;
}

export default function Page(props: Match) {
    return <div>Search results for &quot;{props.locale}&quot;</div>;
}
