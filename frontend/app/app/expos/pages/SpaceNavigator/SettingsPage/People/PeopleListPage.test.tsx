import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import PeopleListPage from './PeopleListPage';
import sinon, { SinonSandbox } from 'sinon';
import AuthStore from '../../../../store/auth';
import {
    sampleSpace,
    sampleMembersWithChat,
    sampleUser,
} from '../../../../test-fixtures/object-mother';
import spaceService, {
    SPACES_UPDATED_EVENT, SPACES_NEW_INVITATION_SENT_EVENT, SPACES_USER_ROLE_UPDATED_EVENT,
} from '../../../../services/space';
import { Role } from '../../../../types/enums';
import { last } from 'lodash';
import { SpaceContext } from '../../SpaceContext';
import { Text } from 'react-native';

describe('PeopleListPage', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should display list of updated roles after a role update', async () => {
        // Test Setup
        const fakeNav = {
            navigate: sandbox.stub(),
        };

        //copy this array to avoid affecting other unit tests.
        const members = sampleMembersWithChat.slice();
        // setup the last member to be a non-guest so we can verify it updates to a guest.
        const lastMember = last(sampleMembersWithChat);
        lastMember.role = Role.MEMBER;

        const getMembers = sandbox
            .stub(spaceService, 'getMembers')
            .resolves(members);
        sandbox.stub(spaceService, 'getInvitations').resolves([]);
        sandbox.stub(spaceService, 'isSoleOwner').resolves(true);

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider
                initialState={
                    {
                        isAuthenticated: true,
                        isLoading: false,
                        currentUser: sampleUser,
                    } as any
                }>
                <SpaceContext.Provider value={{
                    space: sampleSpace,
                    role: Role.OWNER,
                }}>
                    <PeopleListPage
                        navigation={fakeNav as any}
                        space={sampleSpace}
                    />
                </SpaceContext.Provider>
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Precondition Check: Use snapshot to assert preconditions
        expect(testRenderer.toJSON()).toMatchSnapshot();
        // make sure target member starts off as Member role.
        const selector = `SettingsUserItem_${lastMember.member.id}`;
        let targetMemberSettings = testRenderer.root.findByProps({
            testID: selector,
        });
        expect(targetMemberSettings.props.role).toBe(Role.MEMBER);

        // Action: Simulate All members except this user being demoted to guest.
        getMembers.resolves(
            sampleMembersWithChat.map(x => {
                if (x.member.id === sampleUser.id) {
                    return x;
                }

                return {
                    ...x,
                    role: Role.GUEST,
                };
            })
        );
        spaceService.emit(SPACES_UPDATED_EVENT);
        spaceService.emit(SPACES_USER_ROLE_UPDATED_EVENT, {
            space: sampleSpace,
            user: lastMember.member,
            role: Role.GUEST,
        });

        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // // Verify expected results
        targetMemberSettings = testRenderer.root.findByProps({
            testID: selector,
        });
        expect(targetMemberSettings.props.role).toBe(Role.GUEST);
    });

    // TODO: Role is now passed via SpaceContext instead of navigation param.  Need to figure out how to
    // inject and updated role into SpaceContext.
    it.skip('should lose access to admin function when current user gets demoted.', async () => {
        // Test Setup
        const fakeNav = {
            navigate: sandbox.stub(),
        };

        //copy this array to avoid affecting other unit tests.
        const members = sampleMembersWithChat.slice(); 
        // setup the last member to be a non-guest so we can verify it updates to a guest.
        const lastMember = last(sampleMembersWithChat);
        lastMember.role = Role.MEMBER;

        sandbox.stub(spaceService, 'getInvitations').resolves([]);

        const getMembers = sandbox
            .stub(spaceService, 'getMembers')
            .resolves(members);
        sandbox.stub(spaceService, 'isSoleOwner').resolves(false);

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider
                initialState={
                    {
                        isAuthenticated: true,
                        isLoading: false,
                        currentUser: sampleUser,
                    } as any
                }>
                <SpaceContext.Provider value={{
                    space: sampleSpace,
                    role: Role.OWNER,
                }}>
                <PeopleListPage
                    navigation={fakeNav as any}
                />
                </SpaceContext.Provider>
            </AuthStore.Provider>
        );

        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Precondition Check: Use snapshot to assert preconditions
        expect(testRenderer.toJSON()).toMatchSnapshot();
        // Check we have admin access to edit roles by if settings item has a callback trigger.
        const selector = `SettingsUserItem_${lastMember.member.id}`;
        let targetMemberSettings = testRenderer.root.findByProps({
            testID: selector,
        });
        expect(targetMemberSettings.props.onRolePress).toBeTruthy();

        // Action: Simulate current user being demoted to a MEMBER
        getMembers.resolves(
            sampleMembersWithChat.map(x => {
                if (x.member.id === sampleUser.id) {
                    return {
                        ...x,
                        role: Role.MEMBER,
                    };
                }

                return x;
            })
        );
        spaceService.emit(SPACES_UPDATED_EVENT);

        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // // Verify expected results - We should no longer have access to edit user settings.
        targetMemberSettings = testRenderer.root.findByProps({
            testID: selector,
        });
        targetMemberSettings = testRenderer.root.findByProps({
            testID: selector,
        });
        expect(targetMemberSettings.props.onRolePress).toBeNull();
    });

    it('should display list of pending invites', async () => {
        // Test Setup
        const fakeNav = {
            navigate: sandbox.stub(),
        };
        
        // setup the last member to be a non-guest so we can verify it updates to a guest.
        const lastMember = last(sampleMembersWithChat);
        lastMember.role = Role.MEMBER;

        sandbox.stub(spaceService, 'getMembers').resolves([]);
        sandbox.stub(spaceService, 'getInvitations').resolves([
            {
                email: 'jsnow@winterfell.com',
                role: Role.MEMBER,
                user: {
                    id: '123',
                    givenName: 'Jon',
                    familyName: 'Snow',
                    email: 'jsnow@winterfell.com',
                    avatarUrl: null,
                }
            }
        ]);
        sandbox.stub(spaceService, 'isSoleOwner').resolves(true);

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider
                initialState={
                    {
                        isAuthenticated: true,
                        isLoading: false,
                        currentUser: sampleUser,
                    } as any
                }>
                <SpaceContext.Provider value={{
                    space: sampleSpace,
                    role: Role.OWNER,
                }}>
                    <PeopleListPage
                        navigation={fakeNav as any}
                        space={sampleSpace}
                    />
                </SpaceContext.Provider>
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Check rendering matches snapshot.
        expect(testRenderer.toJSON()).toMatchSnapshot();
        // make sure target member starts off as Member role.
        const selector = `SettingsInvitationItem_${'jsnow@winterfell.com'}`;
        let targetMemberSettings = testRenderer.root.findByProps({
            testID: selector,
        });

        const pendingRole = targetMemberSettings.findAllByType(Text).filter(x => {
            return (x.props.children as string) === 'Member (Pending)';
        });
        expect(pendingRole).toHaveLength(1);
    });

    it('should display new invitations after they are sent', async () => {
        // Test Setup
        const fakeNav = {
            navigate: sandbox.stub(),
        };
        
        // setup the last member to be a non-guest so we can verify it updates to a guest.
        const lastMember = last(sampleMembersWithChat);
        lastMember.role = Role.MEMBER;

        sandbox.stub(spaceService, 'getMembers').resolves([]);
        const getInvitations = sandbox.stub(spaceService, 'getInvitations').resolves([
            {
                email: 'jsnow@winterfell.com',
                role: Role.MEMBER,
                user: {
                    id: '123',
                    givenName: 'Jon',
                    familyName: 'Snow',
                    email: 'jsnow@winterfell.com',
                    avatarUrl: null,
                }
            }
        ]);
        sandbox.stub(spaceService, 'isSoleOwner').resolves(true);

        const testRenderer = TestRenderer.create(
            <AuthStore.Provider
                initialState={
                    {
                        isAuthenticated: true,
                        isLoading: false,
                        currentUser: sampleUser,
                    } as any
                }>
                <SpaceContext.Provider value={{
                    space: sampleSpace,
                    role: Role.OWNER,
                }}>
                    <PeopleListPage
                        navigation={fakeNav as any}
                        space={sampleSpace}
                    />
                </SpaceContext.Provider>
            </AuthStore.Provider>
        );
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        // Check Preconditions - we should have 1 invitation.
        expect(testRenderer.toJSON()).toMatchSnapshot();
        
        let elementsWithPendingText = testRenderer.root.findAllByType(Text).filter(x => {
            return (x.props.children as string).includes('Pending');
        });
        expect(elementsWithPendingText).toHaveLength(1);

        // Action - simulate creating a new invitation.
        getInvitations.resolves([
            {
                email: 'jsnow@winterfell.com',
                role: Role.MEMBER,
                user: {
                    id: '123',
                    givenName: 'Jon',
                    familyName: 'Snow',
                    email: 'jsnow@winterfell.com',
                    avatarUrl: null,
                }
            },
            {
                email: 'astark@facelessmen.com',
                role: Role.MEMBER,
                user: null,
            },
        ]);
        spaceService.emit(SPACES_NEW_INVITATION_SENT_EVENT);
        // Await promises to resolve.
        await act(async () => await new Promise(setImmediate));

        elementsWithPendingText = testRenderer.root.findAllByType(Text).filter(x => {
            return (x.props.children as string).includes('Pending');
        });
        expect(elementsWithPendingText).toHaveLength(2);
        // check snapshot to make sure renders ok.
        expect(testRenderer.toJSON()).toMatchSnapshot();
    });
});
