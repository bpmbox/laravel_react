import { useState } from 'react';

const __initialState = {
    queryString: '',
    page: 1,  // Note first page is 1.
    maxPage: 1,
    prevEnabled: false,
    nextEnabled: false,
}

type QueryState = typeof __initialState;

/**
 * Tracks query and current page.
 * Note: Page number starts at 1.  (this is to facillitate binding `page` to UI display)
 * @param initialState
 */
export default function useQueryPaginationState(initialState?: QueryState) {
    const [queryState, setQueryState] = useState<QueryState>(initialState || __initialState)

    const setQuery = (query:string) => {
        setQueryState({
            ...queryState,
            queryString: query,
        });
    };

    const incrementPage = () => {
        const newCurrentPage = queryState.maxPage >= queryState.page + 1 ? queryState.page + 1 : queryState.page;
        setQueryState({
            ...queryState,
            page: newCurrentPage,
            prevEnabled: newCurrentPage > 1,
            nextEnabled: queryState.maxPage > newCurrentPage,
        });
    };

    const decrementPage = () => {
        const newCurrentPage = queryState.page - 1 >= 1 ? queryState.page - 1 : queryState.page;
        setQueryState({
            ...queryState,
            page: newCurrentPage,
            prevEnabled: newCurrentPage > 1,
            nextEnabled: queryState.maxPage > newCurrentPage,
        });
    };

    const resetPage = (maxPage?: number) => {
        // use previous maxPage if not provided
        let newMaxPage = !maxPage ? queryState.maxPage : maxPage;
        // Floor the max at 1, max cannot go below 1.
        newMaxPage = Math.max(newMaxPage, 1);

        setQueryState({
            ...queryState,
            maxPage: newMaxPage,
            page: 1,
            prevEnabled: false,
            nextEnabled: newMaxPage !== 1,
        });
    };

    const setMaxPage = (maxPage: number) => {
        // Floor the max at 1, max cannot go below 1.
        const newMaxPage = Math.max(maxPage, 1);

        const newCurrentPage = newMaxPage >= queryState.page ? queryState.page : newMaxPage;

        setQueryState({
            ...queryState,
            // Prevent paginating out of range.
            page: newCurrentPage,
            maxPage: newMaxPage,
            prevEnabled: newCurrentPage > 1,
            nextEnabled: newMaxPage > newCurrentPage,
        });
    };

    return {
        queryState,
        queryActions: {
            setQuery,
            incrementPage,
            decrementPage,
            resetPage,
            setMaxPage,
        }
    }
}
