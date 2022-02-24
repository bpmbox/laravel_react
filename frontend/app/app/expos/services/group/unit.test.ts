import { GroupService } from '.';
import graphqlService from '../graphql';
import sinon, { SinonSandbox } from 'sinon';
import { sampleSpace, sampleMembersWithChat, sampleGroups } from '../../test-fixtures/object-mother';
import { generateUser } from '../../test-fixtures/test-data-generators';

describe('GroupService', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    describe('getGroups', () => {
        it('should return a list of groups', async () => {
            sandbox.stub(graphqlService, 'query').resolves(({
                data: {
                    space: {
                        groups: [
                            { id: '1', name: 'group1', memberCount: 1 },
                            { id: '2', name: 'group2', memberCount: 1 },
                            { id: '3', name: 'group3', memberCount: 1 },
                        ],
                    },
                },
            } as unknown) as any);
            const groupService = new GroupService();
            const result = await groupService.getGroups(sampleSpace, false);
            expect(result).toHaveLength(3);
            expect(result).toContainEqual({
                id: '2',
                name: 'group2',
                memberCount: 1,
            });
        });
    });

    describe('addGroup', () => {
        it('should return group on success', async () => {
            sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    space: {
                        createGroup: {
                            group: {
                                id: '123',
                                name: 'testgroup',
                            },
                        },
                    },
                },
            });
            const groupService = new GroupService();
            const result = await groupService.addGroup(sampleSpace, 'testgroup');
            expect(result).toStrictEqual({
                id: '123',
                name: 'testgroup',
            });
        });
    });

    describe('getMembers', () => {
        it('should return group on success', async () => {
            sandbox.stub(graphqlService, 'query').resolves(({
                data: {
                    space: {
                        group: {
                            members: sampleMembersWithChat,
                        },
                    },
                },
            } as unknown) as any);

            const groupService = new GroupService();
            const result = await groupService.getMembers(sampleSpace, { id: 'group1', name: 'group1' });
            expect(result).toStrictEqual(sampleMembersWithChat);
        });
    });

    describe('addMembers', () => {
        it('should return updated list of members on success', async () => {
            sandbox.stub(graphqlService, 'mutate').resolves(({
                data: {
                    space: {
                        group: {
                            addMembers: {
                                members: sampleMembersWithChat,
                            },
                        },
                    },
                },
            } as unknown) as any);

            const groupService = new GroupService();
            const result = await groupService.addMembers(
                sampleSpace,
                { id: 'group1', name: 'group1' },
                sampleMembersWithChat.slice(0, 2).map(x => x.member)
            );
            expect(result).toStrictEqual(sampleMembersWithChat);
        });
    });

    describe('removeGroup', () => {
        it('should return void on success', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    space: {
                        group: {
                            delete: {
                                success: true,
                            },
                        },
                    },
                },
            });
            const groupService = new GroupService();
            await groupService.removeGroup(sampleSpace, sampleGroups[0]);
            expect(mutate.called).toBeTruthy();
        });
    });

    describe('renameGroup', () => {
        it('should return void on success', async () => {
            const newName = 'New Name';
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    space: {
                        group: {
                            update: {
                                group: {
                                    id: '1',
                                    name: newName,
                                },
                            },
                        },
                    },
                },
            });
            const groupService = new GroupService();
            const result = await groupService.renameGroup(sampleSpace, sampleGroups[0], newName);

            expect(mutate.called).toBeTruthy();
            expect(result).toStrictEqual({
                id: '1',
                name: newName,
            });
        });
    });

    describe('getSpaceAndGroupMembers', () => {
        it('should return void on success', async () => {
            const groupMembers = sampleMembersWithChat.slice(0, 2);
            const query = sandbox.stub(graphqlService, 'query').resolves({
                data: {
                    space: {
                        group: {
                            members: groupMembers,
                        },
                        members: sampleMembersWithChat,
                    },
                },
            } as any);
            const groupService = new GroupService();
            const result = await groupService.getSpaceAndGroupMembers(sampleSpace, sampleGroups[0]);
            expect(result.groupMembers).toBe(groupMembers);
            expect(result.spaceMembers).toBe(sampleMembersWithChat);
            expect(query.called).toBeTruthy();
        });
    });

    describe('removeMembers', () => {
        it('should return updated members upon success', async () => {
            const groupMembers = Array.from(generateUser(5));
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    space: {
                        group: {
                            removeMembers: {
                                members: groupMembers,
                            },
                        },
                    },
                },
            } as any);
            const groupService = new GroupService();
            const result = await groupService.removeMembers(sampleSpace, sampleGroups[0], Array.from(generateUser(5)));
            expect(result).toBe(groupMembers);
            expect(mutate.called).toBeTruthy();
        });
    });
});
