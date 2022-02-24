import { createContext } from 'react';
import { Role } from '../../types/enums';

type SpaceContextProps = {
    space: Space | null;
    role: Role | null;
};

/**
 * SpaceContext provides space info such as Space and Role to child components of SpaceNavigator.
 */
export const SpaceContext = createContext<SpaceContextProps>({
    space: null,
    role: null,
});
