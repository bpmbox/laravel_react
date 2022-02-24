import { renderHook, act } from '@testing-library/react-hooks';
import useSearch from '.';
import sinon, { SinonSandbox } from 'sinon';

const testData = [
    {
        givenName: 'Jon',
        familyName: 'Snow',
        city: 'Winterfell',
    },
    {
        givenName: 'Sansa',
        familyName: 'Stark',
        city: 'Winterfell',
    },
    {
        givenName: 'Tyrion',
        familyName: 'Lanister',
        city: 'Kings Landing',
    },
    {
        givenName: 'Jamie',
        familyName: 'Lanister',
        city: 'Kings Landing',
    },
    {
        givenName: 'Daenerys',
        familyName: 'Targaryen',
        city: 'Dragonstone',
    },
    {
        givenName: 'Yara',
        familyName: 'Greyjoy',
        city: 'Iron Islands',
    },
];

describe('useSearch', () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('Should return matching search results', async () => {
        // Using a mock save query to remove the debouncing for unit tests.
        const fakeSetQuery = (query: string, setQuery: Function) => {
            setQuery(query);
        };

        const { result } = renderHook(() =>
            useSearch(
                [
                    { path: 'givenName', weight: 0.5 },
                    { path: 'city', weight: 0.5 },
                ],
                fakeSetQuery as any
            )
        );

        act(() => {
            result.current.setData(testData);
        });

        act(() => {
            result.current.setQuery('Tyrion');
        });

        await awaitPromiseQueue();

        expect(result.current.results).toStrictEqual([
            {
                givenName: 'Tyrion',
                familyName: 'Lanister',
                city: 'Kings Landing',
            },
        ]);

        act(() => {
            result.current.setQuery('Winterfell');
        });
        await awaitPromiseQueue();

        expect(result.current.results).toStrictEqual([
            {
                givenName: 'Jon',
                familyName: 'Snow',
                city: 'Winterfell',
            },
            {
                givenName: 'Sansa',
                familyName: 'Stark',
                city: 'Winterfell',
            },
        ]);
    });

    /**
     * We allow partial misspelling within 10 levenstein distance.
     */
    it('Should return fuzzy match results', async () => {
        // Using a mock save query to remove the debouncing for unit tests.
        const fakeSetQuery = (query: string, setQuery: Function) => {
            setQuery(query);
        };

        const { result } = renderHook(() =>
            useSearch(
                [
                    { path: 'givenName', weight: 0.5 },
                    { path: 'city', weight: 0.5 },
                ],
                fakeSetQuery as any
            )
        );

        act(() => {
            result.current.setData(testData);
        });

        act(() => {
            result.current.setQuery('John');
        });

        await awaitPromiseQueue();

        expect(result.current.results).toStrictEqual([
            {
                givenName: 'Jon',
                familyName: 'Snow',
                city: 'Winterfell',
            },
        ]);

        act(() => {
            result.current.setQuery('Drogonstone');
        });

        await awaitPromiseQueue();

        expect(result.current.results).toStrictEqual([
            {
                givenName: 'Daenerys',
                familyName: 'Targaryen',
                city: 'Dragonstone',
            },
        ]);
    });

    it('Should return search results that match ALL search terms.', async () => {
        // Using a mock save query to remove the debouncing for unit tests.
        const fakeSetQuery = (query: string, setQuery: Function) => {
            setQuery(query);
        };

        const { result } = renderHook(() =>
            useSearch(
                [
                    { path: 'givenName', weight: 0.3 },
                    { path: 'city', weight: 0.3 },
                    { path: 'fullName', weight: 0.3 },
                ],
                fakeSetQuery as any
            )
        );

        act(() => {
            result.current.setData(
                testData.map(x => ({
                    ...x,
                    fullName: `${x.givenName} ${x.familyName}`,
                }))
            );
        });

        act(() => {
            result.current.setQuery('Tyrion Lanister');
        });

        await awaitPromiseQueue();

        expect(result.current.results).toStrictEqual([
            {
                givenName: 'Tyrion',
                familyName: 'Lanister',
                city: 'Kings Landing',
                fullName: 'Tyrion Lanister',
            },
        ]);

        act(() => {
            result.current.setQuery('Daenerys Stark');
        });

        await awaitPromiseQueue();

        expect(result.current.results).toStrictEqual([]);
    });
});

async function awaitPromiseQueue() {
    await new Promise(resolve => {
        setImmediate(() => {
            resolve();
        });
    });
}
