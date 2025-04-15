// The contents of this file are pulled from `node_modules/next/image-types/global.d.ts`
// This is done to override `any` type for imported SVGs
// See: https://duncanleung.com/next-js-typescript-svg-any-module-declaration/

interface StaticImageData {
    src: string;
    height: number;
    width: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    blurDataURL?: string;
}

declare module '*.png' {
    const content: StaticImageData;

    export default content;
}

declare module '*.svg' {
    const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default content;
}

declare module '*.jpg' {
    const content: StaticImageData;

    export default content;
}

declare module '*.jpeg' {
    const content: StaticImageData;

    export default content;
}

declare module '*.gif' {
    const content: StaticImageData;

    export default content;
}

declare module '*.webp' {
    const content: StaticImageData;

    export default content;
}

declare module '*.ico' {
    const content: StaticImageData;

    export default content;
}

declare module '*.bmp' {
    const content: StaticImageData;

    export default content;
}
