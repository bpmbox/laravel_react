import React from 'react';
import CalendarGrid from './CalendarGrid';
import { DateTime } from 'luxon';
import { mount } from 'enzyme';

describe('CalendarGrid', (): void => {
    it('renders without issue.', (): void => {
        mount(
            <CalendarGrid
                monthYear={DateTime.local().startOf('month')}
                startDate={DateTime.local().startOf('day')}
                endDate={DateTime.local().plus({ 'days': 1 }).startOf('day')}
                onDateSelected={() => {}} />
        );
    });
});
