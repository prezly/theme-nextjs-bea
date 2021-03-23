import dynamic from 'next/dynamic';

const SlateRenderer = dynamic(() => import('./SlateRenderer'), { ssr: true });

export default SlateRenderer;
