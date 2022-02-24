import { FunctionComponent } from 'react';
import PageRenderer, { PageContent, PAGE_BUTTON_CLICK_EVENT } from '../../../libs/integration/pageRenderer';

type BlocksRendererProps = {
    content: PageContent,
};

const BlocksRenderer: FunctionComponent<BlocksRendererProps> = (props) => {
    const renderer = new PageRenderer(props.content);
    renderer.addListener(PAGE_BUTTON_CLICK_EVENT, (block) => console.log('Clicked on block', block));
    return renderer.render([], 40);
};

export default BlocksRenderer;
