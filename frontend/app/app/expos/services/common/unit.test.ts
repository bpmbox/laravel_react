import { ApolloError } from 'apollo-client';
import { ASTNode } from 'graphql';
import { get, invoke, toPairs } from 'lodash';
import sinon, { SinonSandbox } from 'sinon';
import { CommonService } from '.';
import graphqlService from '../../services/graphql';

describe('common-service', () => {
    let sandbox: SinonSandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        // remove refresh Token from localStorage to ensure clean test.
        localStorage.clear();
    });
    afterEach(() => {
        sandbox.restore();
        localStorage.clear();
    });

    describe('commonGenerateUploadUrl', () => {
        it('should upload file.', async (): Promise<void> => {
            const payload = {
                uploadUrl: 'http://awsimage',
                postParams: { name: 'imagename' },
            };

            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    commonGenerateUploadUrl: payload,
                },
            } as any);

            const commonService = new CommonService();

            const result = await commonService.getPostUrl('myimage');

            expect(mutate.called).toBeTruthy();
            expect(result).toBe(payload);
        });

        it('should handle file upload errors.', async (): Promise<void> => {
            sandbox.stub(graphqlService, 'mutate').rejects(
                new ApolloError({
                    graphQLErrors: [
                        {
                            message: 'File too big.',
                            locations: [{ line: 1, column: 10 }],
                            path: ['User', 'email'],
                            nodes: [{} as ASTNode],
                            source: undefined,
                            positions: [5],
                            originalError: null,
                            name: 'ValidationError',
                            extensions: {},
                        },
                    ],
                    networkError: null,
                })
            );

            const commonService = new CommonService();
            await expect(commonService.getPostUrl('myimage')).rejects.toMatchObject({
                message: 'GraphQL error: File too big.',
            });
        });
    });

    describe('uploadImage', () => {
        it('should upload file', async () => {
            const payload = {
                uploadUrl: 'http://aws-s3-upload-url',
                postParams: {
                    name: 'image.png',
                },
                destUrl: 'http://uploaded-image-url',
            };
            const mutate = sandbox.stub(graphqlService, 'mutate').resolves({
                data: {
                    commonGenerateUploadUrl: payload,
                },
            } as any);
            const fetchStub = sandbox.stub(window, 'fetch').resolves({ ok: true } as Response);
            const imageFile = new File(['image data'], 'image.png', { type: 'image/png' });
            const commonService: CommonServiceTypes.ICommonService = new CommonService();

            const result = await commonService.uploadImage(imageFile);

            expect(mutate.called).toBeTruthy();
            expect(fetchStub.called).toBeTruthy();

            const callArgs = fetchStub.args[0];

            expect(callArgs).toHaveLength(2);
            expect(callArgs[0]).toBe(payload.uploadUrl);
            expect(get(callArgs[1], 'method')).toBe('POST');
            expect(Array.from(invoke(callArgs[1], 'body.entries'))).toEqual(
                toPairs(payload.postParams).concat([['file', imageFile as any]])
            );

            expect(result).toBe(payload.destUrl);
        });
    });
});
