interface Params {
    locale: string;
}

export default async function SearchPage(props: { params: Params }) {
    const { locale } = props.params;
    return <div>Search results page in {locale}</div>;
}
