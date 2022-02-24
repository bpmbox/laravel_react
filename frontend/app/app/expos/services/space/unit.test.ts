import { SpaceService, SPACES_UPDATED_EVENT, SerializableSpace, SerializableUser } from '.';
import graphqlService from '../graphql';
import { ApolloError } from 'apollo-client';
import { ASTNode } from 'graphql';
import { SinonSandbox } from 'sinon';
import sinon from 'sinon';
import {
    sampleSpaces,
    simpleApolloError,
    sampleGroups,
    sampleSpace,
    sampleMembersWithChat,
    sampleUser,
} from '../../test-fixtures/object-mother';
import { Role } from '../../types/enums';

describe('space-service', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    describe('getSpaces', () => {
        it('should return list of spaces', async () => {
            sandbox.stub(graphqlService, 'query').resolves({
                data: {
                    currentUser: {
                        spaces: [
                            {
                                id: 'abc123',
                                name: 'foo',
                                slug: '/bar',
                            },
                        ],
                    },
                },
            } as any);

            const spaceService = new SpaceService();
            const results = await spaceService.getSpaces();

            expect(results).toStrictEqual([
                new SerializableSpace({
                    id: 'abc123',
                    name: 'foo',
                    slug: '/bar',
                }),
            ]);
        });

        it('should throw exception on bad request', async (): Promise<void> => {
            sandbox.stub(graphqlService, 'query').rejects(
                new ApolloError({
                    graphQLErrors: [
                        {
                            message: 'Access denied.',
                            locations: [{ line: 1, column: 10 }],
                            path: ['spacesGetSpaces', 'Space'],
                            nodes: [{} as ASTNode],
                            source: undefined,
                            positions: [5],
                            originalError: null,
                            name: 'AuthorizationError',
                            extensions: {},
                        },
                    ],
                    networkError: null,
                })
            );

            const spaceService = new SpaceService();
            try {
                await spaceService.getSpaces();
            } catch (err) {
                return expect(err.message).toBe('GraphQL error: Access denied.');
            }
            fail('should raise error.');
        });
    });

    describe('getInvitedSpaces', () => {
        it('should return list of spaces', async () => {
            sandbox.stub(graphqlService, 'query').resolves({
                data: {
                    currentUser: {
                        invites: [
                            {
                                space: {
                                    id: 'abc123',
                                    name: 'foo',
                                    slug: '/bar',
                                    iconUrl: '/winterfell.jpg',
                                },
                            },
                        ],
                    },
                },
            } as any);

            const spaceService = new SpaceService();
            const results = await spaceService.getInvitedSpaces();

            expect(results).toStrictEqual([
                new SerializableSpace({
                    id: 'abc123',
                    name: 'foo',
                    slug: '/bar',
                    iconUrl: '/winterfell.jpg',
                }),
            ]);
        });
    });

    describe('createSpace', () => {
        it('should create a new space', async () => {
            sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    spaceCreateNew: {
                        space: {
                            id: 'abc123',
                            name: 'foo',
                            slug: '/bar',
                        },
                    },
                },
            });

            const spaceService = new SpaceService();
            const results = await spaceService.createSpace('foo', '/bar');

            expect(results).toStrictEqual(
                new SerializableSpace({
                    id: 'abc123',
                    name: 'foo',
                    slug: '/bar',
                })
            );
        });

        it('should create a new space with name if slug is omitted', async () => {
            sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    spaceCreateNew: {
                        space: {
                            id: 'abc123',
                            name: 'foo',
                            slug: 'foo',
                        },
                    },
                },
            });

            const spaceService = new SpaceService();
            const results = await spaceService.createSpace('foo', null);

            expect(results).toStrictEqual(
                new SerializableSpace({
                    id: 'abc123',
                    name: 'foo',
                    slug: 'foo',
                })
            );
        });

        it('should throw exception on bad request', async (): Promise<void> => {
            sandbox.stub(graphqlService, 'mutate').rejects(
                new ApolloError({
                    graphQLErrors: [
                        {
                            message: 'Access denied.',
                            locations: [{ line: 1, column: 10 }],
                            path: ['spacesGetSpaces', 'Space'],
                            nodes: [{} as ASTNode],
                            source: undefined,
                            positions: [5],
                            originalError: null,
                            name: 'AuthorizationError',
                            extensions: {},
                        },
                    ],
                    networkError: null,
                })
            );

            const spaceService = new SpaceService();
            try {
                await spaceService.createSpace('FooBar', 'BarFoo');
            } catch (err) {
                return expect(err.message).toBe('GraphQL error: Access denied.');
            }
            fail('should raise error.');
        });
    });

    describe('updateSpace', () => {
        it('should update existing space', async (): Promise<void> => {
            sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    space: {
                        update: {
                            space: {
                                id: 'abc123',
                                name: 'foo',
                                slug: 'bar',
                                iconUrl: '/space-icon.jpg',
                            },
                        },
                    },
                },
            });

            const spaceService = new SpaceService();
            const result = await spaceService.updateSpace({
                id: 'abc123',
                name: 'foo',
                slug: 'bar',
                iconUrl: '/space-icon.jpg',
            });

            expect(result).toStrictEqual(
                new SerializableSpace({
                    id: 'abc123',
                    name: 'foo',
                    slug: 'bar',
                    iconUrl: '/space-icon.jpg',
                })
            );
        });
    });

    describe('checkNameNotTaken', () => {
        it('should resolve true if name is not taken', async (): Promise<void> => {
            sandbox.stub(graphqlService, 'query').resolves({
                data: {
                    spaceCheckNameExists: false,
                },
            } as any);

            const spaceService = new SpaceService();
            const result = await spaceService.checkNameNotTaken('foo');
            expect(result).toBeTruthy();
        });

        it('should resolve false if name is taken', async (): Promise<void> => {
            sandbox.stub(graphqlService, 'query').resolves({
                data: {
                    spaceCheckNameExists: true,
                },
            } as any);

            const spaceService = new SpaceService();
            const result = await spaceService.checkNameNotTaken('foo');
            expect(result).toBeFalsy();
        });
    });

    describe('checkSlugNotTaken', () => {
        it('should resolve true if slug is not taken', async (): Promise<void> => {
            sandbox.stub(graphqlService, 'query').resolves({
                data: {
                    spaceCheckSlugExists: false,
                },
            } as any);

            const spaceService = new SpaceService();
            const result = await spaceService.checkSlugNotTaken('foo');
            expect(result).toBeTruthy();
        });

        it('should resolve false if slug is taken', async (): Promise<void> => {
            sandbox.stub(graphqlService, 'query').resolves({
                data: {
                    spaceCheckSlugExists: true,
                },
            } as any);

            const spaceService = new SpaceService();
            const result = await spaceService.checkSlugNotTaken('foo');
            expect(result).toBeFalsy();
        });
    });

    describe('getInfoBySlug', () => {
        it('should return space info', async () => {
            const query = sandbox.stub(graphqlService, 'query').resolves({
                data: {
                    space: {
                        space: sampleSpace,
                        spaceMembership: {
                            membership: {
                                role: 'admin',
                                chatInfo: {
                                    userId: '123',
                                    accessToken: 'abc',
                                },
                            },
                        },
                        wasInvited: false,
                    },
                },
            } as any);

            const spaceService = new SpaceService();
            const result = await spaceService.getInfoBySlug(sampleSpace.slug);

            expect(query.called).toBeTruthy();
            expect(result).toStrictEqual({
                space: new SerializableSpace(sampleSpace),
                role: Role.ADMIN,
                invited: false,
                chat: {
                    userId: '123',
                    accessToken: 'abc',
                },
            });
        });

        it('should return null if space not found', async () => {
            // simiulate error by returning null data.  This is because this query is
            // run with errorPolicy 'all' which returns data with errors.
            const query = sandbox.stub(graphqlService, 'query').resolves({ data: null } as any);

            const spaceService = new SpaceService();
            const result = await spaceService.getInfoBySlug(sampleSpaces[0].slug);

            expect(query.called).toBeTruthy();
            expect(result).toBe(null);
        });
    });

    it('should return simple error for non-NotFound errors', async () => {
        const query = sandbox.stub(graphqlService, 'query').rejects(simpleApolloError);

        const spaceService = new SpaceService();
        await expect(spaceService.getInfoBySlug(sampleSpaces[0].slug)).rejects.toThrowError('test error');

        expect(query.called).toBeTruthy();
    });

    it('should return simple error for non-graphql error', async () => {
        const query = sandbox.stub(graphqlService, 'query').rejects(new Error('simple error'));

        const spaceService = new SpaceService();
        await expect(spaceService.getInfoBySlug(sampleSpaces[0].slug)).rejects.toThrowError('simple error');

        expect(query.called).toBeTruthy();
    });

    describe('getGroups', () => {
        it('should return list of groups', async () => {
            const query = sandbox.stub(graphqlService, 'query').resolves({
                data: {
                    space: {
                        groups: sampleGroups,
                    },
                },
            } as any);

            const spaceService = new SpaceService();
            const result = await spaceService.getGroups(sampleSpace);

            expect(query.called).toBeTruthy();
            expect(result).toStrictEqual(sampleGroups);
        });
    });

    describe('getMembers', () => {
        it('should return list of members', async () => {
            const query = sandbox.stub(graphqlService, 'query').resolves({
                data: {
                    space: {
                        members: sampleMembersWithChat,
                    },
                },
            } as any);

            const spaceService = new SpaceService();
            const result = await spaceService.getMembers(sampleSpace);

            expect(query.called).toBeTruthy();
            expect(result).toStrictEqual(
                sampleMembersWithChat.map(x => {
                    return {
                        ...x,
                        member: new SerializableUser(x.member),
                    };
                })
            );
        });
    });

    describe('sendInvitation', () => {
        it('should resolve if query is successful', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    space: {
                        invite: {
                            success: true,
                        },
                    },
                },
            } as any);

            const spaceService = new SpaceService();
            await spaceService.sendInvitation(sampleSpace, {
                email: 'foo@bar.com',
                role: Role.MEMBER,
                customMessage: 'test',
                groups: [],
            }); //returns void.

            expect(mutate.called).toBeTruthy();
        });
    });

    describe('updateInvitation', () => {
        it('should resolve if query is successful', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    space: {
                        updateInvitation: {
                            invite: {
                                email: 'jsnow@winterfell.com',
                                role: 'member',
                                message: 'test',
                                groupIds: ['group1', 'group2'],
                            }
                        },
                    },
                },
            } as any);

            const spaceService = new SpaceService();
            await spaceService.updateInvitation(sampleSpace, {
                email: 'jsnow@winterfell.com',
                role: Role.MEMBER, 
            }); //returns void.

            expect(mutate.called).toBeTruthy();
        });
    });

    describe('cancelInvitation', () => {
        it('should resolve if query is successful', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    space: {
                        cancelInvite: {
                            success: true,
                        },
                    },
                },
            } as any);

            const spaceService = new SpaceService();
            await spaceService.cancelInvitation(sampleSpace, 'foo@bar.com'); //returns void.

            expect(mutate.called).toBeTruthy();
        });
    });

    describe('updateRole', () => {
        it('should resolve if query is successful', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    space: {
                        updateMemberRole: {
                            membership: {
                                role: 'member',
                            },
                        },
                    },
                },
            } as any);

            const spaceService = new SpaceService();
            await spaceService.updateRole(sampleSpace, sampleUser, Role.MEMBER); //returns void.

            expect(mutate.called).toBeTruthy();
        });
    });

    describe('removeMember', () => {
        it('should resolve if query is successful', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    space: {
                        removeMember: {
                            success: true,
                        },
                    },
                },
            } as any);

            const spaceService = new SpaceService();
            await spaceService.removeMember(sampleSpace, sampleUser); //returns void.

            expect(mutate.called).toBeTruthy();
        });
    });

    describe('deleteSpace', () => {
        it('should resolve if mutation is successful', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    space: {
                        delete: {
                            success: true,
                        },
                    },
                },
            });
            const listener = jest.fn();

            const spaceService = new SpaceService();

            spaceService.on(SPACES_UPDATED_EVENT, listener);

            const result = await spaceService.deleteSpace(sampleSpace);

            expect(mutate.called).toBeTruthy();
            expect(listener.mock.calls.length).toBe(1);
            expect(result).toBeTruthy();
        });
    });

    describe('leaveSpace', () => {
        it('should resolve if mutation is successful', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    space: {
                        leave: {
                            success: true,
                        },
                    },
                },
            });

            const spaceService = new SpaceService();

            const listener = jest.fn();
            spaceService.on(SPACES_UPDATED_EVENT, listener);

            const result = await spaceService.leaveSpace(sampleSpace);

            expect(mutate.called).toBeTruthy();
            expect(listener.mock.calls.length).toBe(1);
            expect(result).toBeTruthy();
        });
    });

    describe('joinSpace', () => {
        it('should resolve if mutation is successful', async () => {
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    space: {
                        join: {
                            space: {
                                id: sampleSpace.id,
                            },
                        },
                    },
                },
            } as any);

            const spaceService = new SpaceService();
            await spaceService.joinSpace(sampleSpace); //returns void.

            expect(mutate.called).toBeTruthy();
        });
    });

    describe('getInvitations', () => {
        it('should resolve if mutation is successful', async () => {
            const query = sandbox.stub(graphqlService, 'query').resolves({
                data: {
                    space: {
                        invites: [
                            {
                                email: 'jsnow@winterfell.com',
                                role: 'member',
                                user: null,
                            },
                        ],
                    },
                },
            } as any);

            const spaceService = new SpaceService();
            await spaceService.getInvitations(sampleSpace); //returns void.

            expect(query.called).toBeTruthy();
        });
    });
});
