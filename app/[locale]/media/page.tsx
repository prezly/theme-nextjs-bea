interface Props {
    params: {
        locale: string;
    };
}

export default async function MediaPage({ params }: Props) {
    return <div>Media gallery in {params.locale}</div>;
}
