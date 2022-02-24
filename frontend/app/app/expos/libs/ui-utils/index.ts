import { IconBackgroundType } from '../../theme.style';

export const getAvatarProps = (imageUrl?: string, name?: string, leftIconInitial?: string) => {
    let iconProps = {};
    if (imageUrl) {
        iconProps = {
            leftIconImageUrl: imageUrl,
        };
    } else {
        const initial = leftIconInitial || name || '?';
        iconProps = {
            leftIconInitial: initial.charAt(0).toUpperCase(),
        };
    }
    return iconProps;
};

export const getUserIconProps = (user: User) => {
    if (user.avatarUrl) {
        return {
            leftIconImageUrl: user.avatarUrl,
            leftIconBackgroundType: IconBackgroundType.outline,
        };
    } else {
        return {
            leftIconInitial: user.givenName ? user.givenName.charAt(0).toUpperCase() : '?',
            leftIconBackgroundType: IconBackgroundType.plainOutlineLight,
        };
    }
};

export const triggerOnEnter = (onSubmit) => (event) => {
    if (event.nativeEvent.key === 'Enter') {
        onSubmit && onSubmit();
    }
}
