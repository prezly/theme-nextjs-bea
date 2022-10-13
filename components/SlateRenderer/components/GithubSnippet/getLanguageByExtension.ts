import type { Language } from 'prism-react-renderer';

export function getLanguageByExtension(extension: string): Language {
    switch (extension) {
        case 'js':
            return 'javascript';
        case 'jsx':
            return 'jsx';
        case 'ts':
            return 'typescript';
        case 'tsx':
            return 'tsx';
        case 'json':
            return 'json';
        case 'sh':
            return 'bash';
        case 'css':
            return 'css';
        case 'less':
            return 'less';
        case 'sass':
            return 'sass';
        case 'scss':
            return 'sass';
        case 'sql':
            return 'sql';
        case 'yaml':
        case 'yml':
            return 'yaml';
        case 'py':
            return 'python';
        default:
            return 'markdown';
    }
}
