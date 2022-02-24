import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';
import Fuse, { FuseOptions } from 'fuse.js';

/**
 * Set the data to be indexed.
 */
type SetData<T> = (data: T[]) => void;

/**
 * Set the query term.
 */
type SetQuery = (query: string) => void;

type SearchKey = {
    path: string;
    weight: number;
};

type SearchHookFields<T> = {
    /**
     * Results matching query.
     */
    results: T[];
    /**
     * All indexed objects
     */
    all: T[];
    /**
     * Set the data source.
     */
    setData: SetData<T>;
    /**
     * Set the query string, this will update the results returned by this hook..
     */
    setQuery: SetQuery;
}

const DEFAULT_FUSE_OPTIONS = {
    shouldSort: true,
    tokenize: true,
    matchAllTokens: true,
    findAllMatches: true,
    includeScore: false,
    threshold: 0.3,
    location: 0,
    distance: 10,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [],
}

// Creating the method outside of the hook so we can apply debouncing
const debouncedSetQueryString = debounce((query: string, setQuery) => {
    // istanbul ignore next
    setQuery(query);
}, 200, { trailing: true });


/**
 * Hook for filtering search results.  Note: results will be empty [] if no query string is given.
 * @param searchFields An array of indexing paths.  ex: ['user.givenName', 'user.familyName', 'user.email']
 * @param __debouncedSetQueryString Do not use this param, this is used for dependency injection
 */
function useSearch<T>(searchFields:SearchKey[], __debouncedSetQueryString=debouncedSetQueryString): SearchHookFields<T> {
    const [fuse, setFuse] = useState<Fuse<T, FuseOptions<T>>>();
    const [query, setQuery] = useState<string>();
    const [results, setResults] = useState<T[]>([]);

    const setData = (data: T[]) => {
        const fuseOptions = Object.assign({}, DEFAULT_FUSE_OPTIONS, {
            keys: searchFields.map( x => ({ name: x.path, weight: x.weight})),
        });

        const fuse = new Fuse<T, FuseOptions<T>>(data, fuseOptions);
        setFuse(fuse);
    }
    
    const performQuery = (query:string) => {
        // Calling our debounced version to avoid thrashing the CPU usage from too many queries.
        __debouncedSetQueryString(query, setQuery);
    }

    // update search results when query gets updated.
    useEffect(() => {
        if(fuse && query) {
            setResults(fuse.search(query) as T[]);
        } else if (fuse) {
            setResults(fuse.search('') as T[]);
        }
    }, [fuse, query])

    return {
        results,
        // access fuse's internal list.  So we can use thee list in fuse as single source of truth.
        all: fuse?(fuse as any).list:[],
        setData,
        setQuery: performQuery,
    }
};

export default useSearch;