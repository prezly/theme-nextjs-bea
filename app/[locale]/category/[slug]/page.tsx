interface Props {
    params: {
        locale: string;
        slug: string;
    };
}

export default async function CategoryPage({ params }: Props) {
    return (
        <div>
            Category Page for {params.slug} in {params.locale}
        </div>
    );
}
