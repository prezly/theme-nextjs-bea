interface Props {
    params: {
        locale: string;
        uuid: string;
    };
}

export default async function AlbumPage({ params }: Props) {
    return <div>Album: {params.uuid}</div>;
}
