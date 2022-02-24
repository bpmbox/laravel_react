import { mount } from 'enzyme';
import React from 'react';
import QR from './QR';

describe('QR', (): void => {
    it('Renders without issue.', (): void => {
        mount(
            <QR value='123' />
        );
    });
});
