import getDefaultEntrySpace from '.';
import { sampleUser, sampleSpace, sampleSpaceInfo } from '../../test-fixtures/object-mother';
import { SinonSandbox } from 'sinon';
import sinon from 'sinon';
import trackingService from '../../services/tracking';
import spaceService from '../../services/space';


describe('getDefaultEntrySpace', () => {
    let sandbox: SinonSandbox;
    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        jest.resetModules();
    });

    afterEach((): void => {
        sandbox.restore();
    });

    it('should get last visited space when available', async () => {
        sandbox.stub(trackingService, 'getLastVisitedSpace').resolves(sampleSpace)
        sandbox.stub(spaceService, 'getSpaces').resolves([sampleSpace]);
        sandbox.stub(spaceService, 'getInfoById').resolves(sampleSpaceInfo);

        const space = await getDefaultEntrySpace(sampleUser);

        expect(space).toStrictEqual(sampleSpace);
    });

    it('should get first space if last visited space not available', async () => {
        sandbox.stub(trackingService, 'getLastVisitedSpace').resolves(null)
        sandbox.stub(spaceService, 'getSpaces').resolves([sampleSpace, { id: '2t2t2', name: 'space2', slug: 'space2' }]);

        const space = await getDefaultEntrySpace(sampleUser);

        expect(space).toStrictEqual(sampleSpace);
    });

    it('should return null if user does not have any spaces', async () => {
        sandbox.stub(trackingService, 'getLastVisitedSpace').resolves(null)
        sandbox.stub(spaceService, 'getSpaces').resolves([]);

        const space = await getDefaultEntrySpace(sampleUser);

        expect(space).toBeNull();
    });

    it('should return first space if their last visited space was deleted', async () => {
        sandbox.stub(trackingService, 'getLastVisitedSpace').resolves(sampleSpace)
        sandbox.stub(spaceService, 'getSpaces').resolves([{ id: '2t2t2', name: 'space2', slug: 'space2' }]);
        sandbox.stub(spaceService, 'getInfoById').resolves(null);

        const space = await getDefaultEntrySpace(sampleUser);

        expect(space).toStrictEqual({ id: '2t2t2', name: 'space2', slug: 'space2' });
    });

    it('should return null if error when getting last visited space and spaces', async () => {
        sandbox.stub(trackingService, 'getLastVisitedSpace').rejects()
        sandbox.stub(spaceService, 'getSpaces').rejects();

        const space = await getDefaultEntrySpace(sampleUser);

        expect(space).toBeNull();
    });
});