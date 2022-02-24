declare namespace NSTrackingService {
    interface ITrackingService {
        reportSpaceVisit(currentUserId: string, space: Space): Promise<void>;
        getLastVisitedSpace(currentUserId: string): Promise<Space | null>;
    }
}
