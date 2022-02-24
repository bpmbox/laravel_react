import { IconId } from '../../assets/native/svg-icons'
import i18n from '../../i18n';
import sortedUniq from 'lodash/sortedUniq';
import find from 'lodash/find';
import defaultTo from 'lodash/defaultTo';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';

export enum Category {
    amenities = 'amenities',
    analytics = 'analytics',
    finance = 'finance',
    food_n_drink = 'food_n_drink',
    fun = 'fun',
    guest_access = 'guest_access',
    human_resources = 'human_resources',
    informational = 'informational',
    marketing = 'marketing',
    news_n_media = 'news_n_media',
    productivity = 'productivity',
    security = 'security',
    service_requests = 'service_requests',
    social = 'social',
    support = 'support',
    wellness = 'wellness',
}

export const allCategories = sortedUniq(Object.values(Category));

export const topCategories = [
    Category.amenities,
    Category.food_n_drink,
    Category.informational,
    Category.news_n_media,
    Category.social,
    Category.support,
]

const CATEGORY_INFO = {
    [Category.amenities]: { icon: IconId.multicolor_sofa, name: i18n.t('Categories::Amenities') },
    [Category.analytics]: { icon: IconId.multicolor_analytics, name: i18n.t('Categories::Analytics') },
    [Category.finance]: { icon: IconId.multicolor_finance, name: i18n.t('Categories::Finance') },
    [Category.food_n_drink]: { icon: IconId.multicolor_food, name: i18n.t('Categories::Food & Drink') },
    [Category.fun]: { icon: IconId.multicolor_fun, name: i18n.t('Categories::Fun') },
    [Category.guest_access]: { icon: IconId.multicolor_badge, name: i18n.t('Categories::Guest Access') },
    [Category.human_resources]: { icon: IconId.multicolor_people, name: i18n.t('Categories::Human Resources') },
    [Category.informational]: { icon: IconId.multicolor_guide, name: i18n.t('Categories::Informational') },
    [Category.marketing]: { icon: IconId.multicolor_announcement, name: i18n.t('Categories::Marketing') },
    [Category.news_n_media]: { icon: IconId.multicolor_news, name: i18n.t('Categories::News & Media') },
    [Category.productivity]: { icon: IconId.multicolor_booking, name: i18n.t('Categories::Productivity') },
    [Category.security]: { icon: IconId.multicolor_lock, name: i18n.t('Categories::Security') },
    [Category.service_requests]: { icon: IconId.multicolor_ticketing, name: i18n.t('Categories::Service Requests') },
    [Category.social]: { icon: IconId.multicolor_group_chat, name: i18n.t('Categories::Social') },
    [Category.support]: { icon: IconId.multicolor_service, name: i18n.t('Categories::Support') },
    [Category.wellness]: { icon: IconId.multicolor_wellness, name: i18n.t('Categories::Wellness') },
};

export const categoryName = (category: Category): string => {
    return category in CATEGORY_INFO ? CATEGORY_INFO[category].name : i18n.t('Categories::Unknown')
}

export const categoryIcon = (category: Category): IconId => {
    return category in CATEGORY_INFO ? CATEGORY_INFO[category].icon : IconId.multicolor_sofa
}

export const categoryFromCodename = (codename: string): Category | undefined => {
    return Category[codename];
}

export const MANDATORY_PERMISSION = {
    name: i18n.t('Permissions::Can View'),
    codename: "can_view",
    label: i18n.t('Permissions::Can View')
}

export const permissionToString = (permission: string): string | null => {
    switch (permission) {
        case 'full_access': return i18n.t('Permissions::Full Access');
        case 'can_edit': return i18n.t('Permissions::Can Edit');
        case 'can_comment': return i18n.t('Permissions::Can Comment');
        case 'can_view': return i18n.t('Permissions::Can View');
    }
    return null;
}

export const generatePermissionsString = (permissions: string[]) => {
    return permissions
        .map((permission) => permissionToString(permission))
        .filter((x) => x !== null)
        .join(', ');
}

export const getIntegrationPermissionsForUser = (installationInfo: NSIntegration.InstallationInfo, user: User): string[] | null => {
    const found = find(installationInfo.usersPermissions, (permission: NSIntegration.UserPermissions) => {
        return permission.user.id === user.id
    });
    if (found) {
        return found.permissions;
    }
    return null;
}

export const getIntegrationPermissionsForGroup = (installationInfo: NSIntegration.InstallationInfo, group: Group): string[] | null => {
    const found = find(installationInfo.groupsPermissions, (permission: NSIntegration.GroupPermissions) => {
        return permission.group.id === group.id
    });
    if (found) {
        return found.permissions;
    }
    return null;
}

export const getAllPermissionsForUser = (info: NSIntegration.InstallationInfo, user: User, groups: Group[]) => {
    const permissionsForUser = defaultTo(getIntegrationPermissionsForUser(info, user), []);
    const permissionsForGroups = flatten(groups.map((group) => defaultTo(getIntegrationPermissionsForGroup(info, group), [])));
    return uniq(flatten([permissionsForUser, permissionsForGroups]));
}

export const takeChanges = (values, formData) => {
    let changes: NSIntegration.UpdateIntegrationParams = {};
    Object.keys(values).forEach(k => {
        // @ts-ignore
        if (values[k] !== formData[k]) {
            changes[k] = values[k]
        };
    });
    return changes;
}
