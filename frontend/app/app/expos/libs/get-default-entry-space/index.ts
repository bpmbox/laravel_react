import trackingService from '../../services/tracking';
import spaceService from '../../services/space';

/**
 * Gets space user should load if they are entering Space Index
 * page.  It will attempt to find their last visited space, if
 * that does not exist, it will get the first space they are a
 * member of.  If that does not exist, this will return null.
 */
export default async function getDefaultEntrySpace(currentUser: User): Promise<Space | null> {
    // check if user has last visited another space.

    try {
        const lastVisitedSpace = await trackingService.getLastVisitedSpace(currentUser.id);
        if (lastVisitedSpace) {
            // Re-fetch the space because space Data could have changed since last
            // login.
            const refechedSpaceInfo = await spaceService.getInfoById(lastVisitedSpace.id);
            if (refechedSpaceInfo) {
                return refechedSpaceInfo.space;
            }
        }
    } catch (e) {
        console.error('Unable to retrieve last visited space', e);
        trackingService.removeLastVisitedSpace(currentUser.id);
    }

    // If user has not visited a space yet, try to get a space they are a member of.
    try {
        const spaces = await spaceService.getSpaces();
        if (spaces.length > 0) {
            return spaces[0];
        }
    } catch (err) {
        console.error(err);
    }

    return null;
}
