import { mount } from 'enzyme';
import React from 'react';
import Spinner from '.';

describe('Spinner', (): void => {
    it('renders without issue.', (): void => {
        mount(
            <Spinner />
        );
    });
});
