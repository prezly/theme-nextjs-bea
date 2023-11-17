interface Props {
    variables: Record<string, string>;
}

export function InjectCssVariables({ variables }: Props) {
    return (
        <style
            dangerouslySetInnerHTML={{
                __html: `:root {${Object.entries(variables)
                    .map(([variable, value]) => `${variable}: ${value}`)
                    .join(';')}}`,
            }}
        />
    );
}
