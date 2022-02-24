import { FunctionComponent } from 'react';
import PageRenderer, {
    PageContent,
    PAGE_LINK_CLICK_EVENT
} from '../../libs/integration/pageRenderer';

type TestPageProps = {
    content: PageContent;
};

const TestPage: FunctionComponent<TestPageProps> = (props) => {
    const renderer = new PageRenderer(props.content);
    renderer.addListener(PAGE_LINK_CLICK_EVENT, (block) => console.log('Clicked on block', block));
    return renderer.render([]);
};

export default TestPage;
