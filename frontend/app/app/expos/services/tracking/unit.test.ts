import { TrackingService } from '.';
import sinon, { SinonStub } from 'sinon';
import { sampleSpace } from '../../test-fixtures/object-mother';

describe('TrackingService', () => {
    const userId = '111111';

    it('should save reported Space to local storage', () => {
        const mockStorage = ({
            setItem: sinon.stub(),
        } as unknown) as NSStorageService.StorageServiceType;

        const trackingService = new TrackingService(mockStorage);
        trackingService.reportSpaceVisit(userId, sampleSpace);

        expect(
            (mockStorage.setItem as SinonStub).calledWith(`lastSpace_${userId}`, JSON.stringify(sampleSpace))
        ).toBeTruthy();
    });

    it('should get reported Space from local storage', async () => {
        const mockStorage = ({
            getItem: sinon.stub().returns(JSON.stringify(sampleSpace)),
        } as unknown) as NSStorageService.StorageServiceType;

        const trackingService = new TrackingService(mockStorage);
        const lastSpace = await trackingService.getLastVisitedSpace(userId);

        expect(lastSpace).toStrictEqual(sampleSpace);
    });
});
