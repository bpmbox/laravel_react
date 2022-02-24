import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import routes from '../../../../routes';
import alertService from '../../../../services/alert';
import historyService from '../../../../services/history';
import messageService from '../../../../services/message';
import spaceService from '../../../../services/space';
import trackingService from '../../../../services/tracking';
import AuthStore from '../../../../store/auth';
import { SpaceContext } from '../../SpaceContext';


export const useLeaveSpaceDialog = () => {
    const { t } = useTranslation('SpaceSettingsPage');
    const { currentUser } = AuthStore.useContainer();
    const { space } = useContext(SpaceContext);


    const handleLeaveSpace = async () => {
        try {
            const success = await spaceService.leaveSpace(space);
            await trackingService.removeLastVisitedSpace(currentUser.id);

            if (success) {
                historyService.navigateAsRoot(routes.MAIN_SPACE_REDIRECT);
            }
        } catch(err) {
            messageService.sendError(err.message);
        }
    };

    const show = async () => {
        const isSoleOwner = await spaceService.isSoleOwner(currentUser, space);

        if (isSoleOwner) {
            alertService.alert(
                t`You Cannot Leave This Space`,
                t`You are the only Owner of this space. In order to leave the space, please set another Owner first, or delete the space entirely.`,
                [
                    { text: t`OK`, style: 'default' }
                ],
                false,
            );
        } else {
            alertService.alert(
                t('Leave {{spaceName}}?', { spaceName: space.name }),
                '',
                [
                    { text: t`Cancel`, style: 'cancel' },
                    { text: t`Leave`, style:'destructive', onPress: handleLeaveSpace},
                ],
                true,
            );
        }
    };

    return {
        show,
    }
};
