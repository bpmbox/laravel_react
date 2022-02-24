import useMemberSearch from '.';
import { SinonSandbox, SinonFakeTimers } from 'sinon';
import sinon from 'sinon';
import { renderHook, act } from '@testing-library/react-hooks';
import { sampleSpace, sampleMembersWithChat } from '../../test-fixtures/object-mother';
import spaceService from '../../services/space';
import { Role } from '../../types/enums';

describe('useMemberSearch', () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.useFakeTimers();
    });
    afterEach(() => {
        sandbox.restore();
    });

    it('Should fetch members from spaceService', async () => {
        // Using a mock save query to remove the debouncing for unit tests.
        sandbox.stub(spaceService, 'getMembers').resolves(sampleMembersWithChat);

        const { result } = renderHook(() => useMemberSearch(sampleSpace));
        await awaitPromises(sandbox.clock, 600);

        // Verify we have the same elements, but they can be ordered differently.
        expect(result.current.all).toHaveLength(sampleMembersWithChat.length);
    });

    it('should have isError flag true if there was a fetch error.', async () => {
        // Using a mock save query to remove the debouncing for unit tests.
        sandbox.stub(spaceService, 'getMembers').rejects();

        const { result } = renderHook(() => useMemberSearch(sampleSpace));
        await awaitPromises(sandbox.clock, 600);
        // await 1 more time for side effect promises to resolve.
        await awaitPromises(sandbox.clock, 600);

        // Verify we have the same elements, but they can be ordered differently.
        expect(result.current.isLoadinig).toBeFalsy();
        expect(result.current.isError).toBeTruthy();
    });

    it('should return expected search results.', async () => {
        // Using a mock save query to remove the debouncing for unit tests.
        sandbox.stub(spaceService, 'getMembers').resolves([
            ...sampleMembersWithChat,
            {
                member: {
                    id: 'T801',
                    givenName: 'Carl',
                    familyName: 'Dyson',
                    email: 'carl@cyberdyne.com',
                    avatarUrl: 'https://www.screengeek.net/wp-content/uploads/2019/07/terminator-dark-fate.jpg',
                },
                role: Role.ADMIN,
                chat: {
                    userId: '1111',
                    accessToken: null,
                },
            },
        ]);

        const { result } = renderHook(() => useMemberSearch(sampleSpace));
        await awaitPromises(sandbox.clock, 600);

        // Assert precondition - make sure the data has loaded
        expect(result.current.all).toHaveLength(sampleMembersWithChat.length + 1);

        // Perform query.
        act(() => {
            result.current.setQuery('carl');
        });
        // Await trailinig edge debounce timeout to trigger.
        await awaitPromises(sandbox.clock, 300);

        // Await side effect to trigger after the debounce timeout.
        act(() => {}); // Adding act() here to force renderHook to rerender.
        await awaitPromises(sandbox.clock);

        // Assert results - first result should be most relavent, the one containing the exact match
        expect(result.current.results[0].member.id).toBe('T801');
    });
});

async function awaitPromises(clock: SinonFakeTimers, timeout?: number) {
    await new Promise(resolve => {
        setImmediate(() => {
            resolve();
        });
        clock.tick(timeout || 50);
    });
}
