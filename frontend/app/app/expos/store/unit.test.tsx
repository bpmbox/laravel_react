import { mount } from 'enzyme';
import React from 'react';
import ApplyStores from '.';

describe('ApplyStores', (): void => {
    it('renders without issue.', (): void => {
        mount(
            <ApplyStores>
                <div>Content</div>
            </ApplyStores>
        );
    });
});
