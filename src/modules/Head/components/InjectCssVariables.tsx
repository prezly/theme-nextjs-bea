interface Props {
    variables: Record<string, string>;
}

export function InjectCssVariables({ variables }: Props) {
    const css = Object.entries(variables)
        .map(([variable, value]) => `${variable}: ${value}`)
        .join(';\n');

    // biome-ignore lint/security/noDangerouslySetInnerHtml: <...>
    return <style dangerouslySetInnerHTML={{ __html: `:root { ${css} }` }} />;
}
