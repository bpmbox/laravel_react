import useQueryPaginationState from '.';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useQueryPaginationState', () => {
    it('should prev and next button should enable disable as we increment/decrement page numbers', () => {
        const { result } = renderHook(() =>
            useQueryPaginationState({
                queryString: 'Hodor',
                maxPage: 3,
                page: 1,
                prevEnabled: false,
                nextEnabled: true,
            })
        );
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(1);
        expect(result.current.queryState.maxPage).toBe(3);
        expect(result.current.queryState.prevEnabled).toBeFalsy();
        expect(result.current.queryState.nextEnabled).toBeTruthy();

        // paginate to page 2
        act(() => {
            result.current.queryActions.incrementPage();
        });
        expect(result.current.queryState.page).toBe(2);
        expect(result.current.queryState.maxPage).toBe(3);
        expect(result.current.queryState.prevEnabled).toBeTruthy();
        expect(result.current.queryState.nextEnabled).toBeTruthy();

        // paginate to page 3
        act(() => {
            result.current.queryActions.incrementPage();
        });
        expect(result.current.queryState.page).toBe(3);
        expect(result.current.queryState.maxPage).toBe(3);
        expect(result.current.queryState.prevEnabled).toBeTruthy();
        expect(result.current.queryState.nextEnabled).toBeFalsy();

        // paginate to page 2
        act(() => {
            result.current.queryActions.decrementPage();
        });
        expect(result.current.queryState.page).toBe(2);
        expect(result.current.queryState.maxPage).toBe(3);
        expect(result.current.queryState.prevEnabled).toBeTruthy();
        expect(result.current.queryState.nextEnabled).toBeTruthy();

        // paginate to page 1
        act(() => {
            result.current.queryActions.decrementPage();
        });
        expect(result.current.queryState.page).toBe(1);
        expect(result.current.queryState.maxPage).toBe(3);
        expect(result.current.queryState.prevEnabled).toBeFalsy();
        expect(result.current.queryState.nextEnabled).toBeTruthy();
    });

    it('should should not paginate higher than maxPage', () => {
        const { result } = renderHook(() =>
            useQueryPaginationState({
                queryString: 'Hodor',
                maxPage: 3,
                page: 3,
                prevEnabled: true,
                nextEnabled: false,
            })
        );
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(3);
        expect(result.current.queryState.maxPage).toBe(3);
        expect(result.current.queryState.prevEnabled).toBeTruthy();
        expect(result.current.queryState.nextEnabled).toBeFalsy();

        // attempt to paginate to page 4
        act(() => {
            result.current.queryActions.incrementPage();
        });

        // should remain in same state.
        expect(result.current.queryState.page).toBe(3);
        expect(result.current.queryState.maxPage).toBe(3);
        expect(result.current.queryState.prevEnabled).toBeTruthy();
        expect(result.current.queryState.nextEnabled).toBeFalsy();
    });

    it('should should not paginate lower than page 1', () => {
        const { result } = renderHook(() =>
            useQueryPaginationState({
                queryString: 'Hodor',
                maxPage: 3,
                page: 1,
                prevEnabled: false,
                nextEnabled: true,
            })
        );
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(1);
        expect(result.current.queryState.maxPage).toBe(3);
        expect(result.current.queryState.prevEnabled).toBeFalsy();
        expect(result.current.queryState.nextEnabled).toBeTruthy();

        // attempt to paginate to page 0
        act(() => {
            result.current.queryActions.decrementPage();
        });
        // should remain in same state.
        expect(result.current.queryState.page).toBe(1);
        expect(result.current.queryState.maxPage).toBe(3);
        expect(result.current.queryState.prevEnabled).toBeFalsy();
        expect(result.current.queryState.nextEnabled).toBeTruthy();
    });

    it('reset should return to page one', () => {
        const { result } = renderHook(() =>
            useQueryPaginationState({
                queryString: 'Hodor',
                maxPage: 3,
                page: 3,
                prevEnabled: true,
                nextEnabled: false,
            })
        );
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(3);
        expect(result.current.queryState.maxPage).toBe(3);
        expect(result.current.queryState.prevEnabled).toBeTruthy();
        expect(result.current.queryState.nextEnabled).toBeFalsy();

        act(() => {
            result.current.queryActions.resetPage();
        });
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(1);
        expect(result.current.queryState.maxPage).toBe(3);
        expect(result.current.queryState.prevEnabled).toBeFalsy();
        expect(result.current.queryState.nextEnabled).toBeTruthy();
    });

    it('reset should return to page one, even if maxPage changes', () => {
        const { result } = renderHook(() =>
            useQueryPaginationState({
                queryString: 'Hodor',
                maxPage: 3,
                page: 3,
                prevEnabled: true,
                nextEnabled: false,
            })
        );
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(3);
        expect(result.current.queryState.maxPage).toBe(3);
        expect(result.current.queryState.prevEnabled).toBeTruthy();
        expect(result.current.queryState.nextEnabled).toBeFalsy();

        act(() => {
            result.current.queryActions.resetPage(5);
        });
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(1);
        expect(result.current.queryState.maxPage).toBe(5);
        expect(result.current.queryState.prevEnabled).toBeFalsy();
        expect(result.current.queryState.nextEnabled).toBeTruthy();
    });

    it('reset if maxPage was not provided previously shoudl default to 1 as max page.', () => {
        const { result } = renderHook(() =>
            useQueryPaginationState({
                queryString: 'Hodor',
                maxPage: 0,
                page: 1,
                prevEnabled: true,
                nextEnabled: false,
            })
        );
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(1);
        expect(result.current.queryState.maxPage).toBe(0);
        expect(result.current.queryState.prevEnabled).toBeTruthy();
        expect(result.current.queryState.nextEnabled).toBeFalsy();

        // paginate to page 2
        act(() => {
            result.current.queryActions.resetPage();
        });
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(1);
        expect(result.current.queryState.maxPage).toBe(1);
        expect(result.current.queryState.prevEnabled).toBeFalsy();
        expect(result.current.queryState.nextEnabled).toBeFalsy();
    });

    it('setMaxPage should retain same page number if within range', () => {
        const { result } = renderHook(() =>
            useQueryPaginationState({
                queryString: 'Hodor',
                maxPage: 5,
                page: 3,
                prevEnabled: true,
                nextEnabled: true,
            })
        );
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(3);
        expect(result.current.queryState.maxPage).toBe(5);
        expect(result.current.queryState.prevEnabled).toBeTruthy();
        expect(result.current.queryState.nextEnabled).toBeTruthy();

        // paginate to page 2
        act(() => {
            result.current.queryActions.setMaxPage(3);
        });
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(3);
        expect(result.current.queryState.maxPage).toBe(3);
        expect(result.current.queryState.prevEnabled).toBeTruthy();
        expect(result.current.queryState.nextEnabled).toBeFalsy();
    });

    it('setMaxPage should drop to maxPage number if out of range of new maxPage', () => {
        const { result } = renderHook(() =>
            useQueryPaginationState({
                queryString: 'Hodor',
                maxPage: 5,
                page: 3,
                prevEnabled: true,
                nextEnabled: true,
            })
        );
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(3);
        expect(result.current.queryState.maxPage).toBe(5);
        expect(result.current.queryState.prevEnabled).toBeTruthy();
        expect(result.current.queryState.nextEnabled).toBeTruthy();

        // paginate to page 2
        act(() => {
            result.current.queryActions.setMaxPage(2);
        });
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(2);
        expect(result.current.queryState.maxPage).toBe(2);
        expect(result.current.queryState.prevEnabled).toBeTruthy();
        expect(result.current.queryState.nextEnabled).toBeFalsy();
    });

    it('setMaxPage to invalid value should use 1 as default maxPage value.', () => {
        const { result } = renderHook(() =>
            useQueryPaginationState({
                queryString: 'Hodor',
                maxPage: 5,
                page: 3,
                prevEnabled: true,
                nextEnabled: true,
            })
        );
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(3);
        expect(result.current.queryState.maxPage).toBe(5);
        expect(result.current.queryState.prevEnabled).toBeTruthy();
        expect(result.current.queryState.nextEnabled).toBeTruthy();

        // paginate to page 2
        act(() => {
            result.current.queryActions.setMaxPage(0);
        });
        // Assert starting conditionos
        expect(result.current.queryState.page).toBe(1);
        expect(result.current.queryState.maxPage).toBe(1);
        expect(result.current.queryState.prevEnabled).toBeFalsy();
        expect(result.current.queryState.nextEnabled).toBeFalsy();
    });
});
