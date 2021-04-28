import type { FunctionComponent } from 'react';
import { Node, Renderer } from '@prezly/slate-renderer';
import '@prezly/slate-renderer/build/styles.css';

interface Props {
    nodes: Node | Node[];
}

const SlateRenderer: FunctionComponent<Props> = ({ nodes }) => <Renderer nodes={nodes} />;

export default SlateRenderer;
