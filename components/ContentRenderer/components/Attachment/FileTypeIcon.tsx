import {
    IconFileTypeAe,
    IconFileTypeAi,
    IconFileTypeDefault,
    IconFileTypeExcel,
    IconFileTypeId,
    IconFileTypeImage,
    IconFileTypePdf,
    IconFileTypePowerpoint,
    IconFileTypePsd,
    IconFileTypeSound,
    IconFileTypeVideo,
    IconFileTypeWord,
    IconFileTypeXd,
    IconFileTypeZip,
} from '@/icons';

interface Props {
    className?: string;
    extension?: string;
}

function getIconComponentFromExtension(extension?: string) {
    switch (extension) {
        case 'ae':
            return IconFileTypeAe;
        case 'ai':
            return IconFileTypeAi;
        case 'xls':
        case 'xlsx':
            return IconFileTypeExcel;
        case 'id':
            return IconFileTypeId;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'svg':
        case 'webp':
            return IconFileTypeImage;
        case 'pdf':
            return IconFileTypePdf;
        case 'ppt':
        case 'pptx':
            return IconFileTypePowerpoint;
        case 'psd':
            return IconFileTypePsd;
        case 'mp3':
        case 'wav':
        case 'ogg':
            return IconFileTypeSound;
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'mpeg':
        case 'webm':
        case 'flv':
        case 'ogv':
            return IconFileTypeVideo;
        case 'doc':
        case 'docx':
            return IconFileTypeWord;
        case 'xd':
            return IconFileTypeXd;
        case 'zip':
        case 'rar':
        case 'tar':
        case 'gz':
        case '7z':
            return IconFileTypeZip;
        default:
            return IconFileTypeDefault;
    }
}

export function FileTypeIcon({ extension, className }: Props) {
    const IconComponent = getIconComponentFromExtension(extension);
    return <IconComponent className={className} />;
}
