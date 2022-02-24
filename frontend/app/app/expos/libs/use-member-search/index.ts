import {useEffect, useState} from 'react';
import get from 'lodash/get';
import useSearch from '../use-search';
import spaceService from '../../services/space';

/**
 * @param space space to grab members off.
 * @param options Additional options such as dependency injection.
 */
export default function useMemberSearch(space: Space, options?: NSUseMemberSearch.UseMemberSearchOptions) {
    const { results, all, setData, setQuery } = useSearch<Membership>([
        { path: 'member.email', weight: 0.5 },
        { path: 'member.familyName', weight: 0.25 },
        { path: 'member.givenName', weight: 0.15 },
        { path: 'fullName', weight: 0.10 },
    ]);
    const [loadingState, setLoadingState] = useState({
        isLoading: true,
        isError: false
    });


    // Fetch members on init.
    useEffect(() => {
        // Use DI service if provided.
        const spaceServ = get(options, 'spaceService', spaceService) as SpaceServiceTypes.ISpacesService;
        spaceServ.getMembers(space)
            .then((members) => {
                const memberSearchEntries = members
                    .map((membership: Membership) => ({
                        ...membership,
                        // Add a fullName property we can index on.
                        fullName: `${membership.member.givenName} ${membership.member.familyName}`,
                    }))
                    .sort((x, y) => {
                        return x.fullName.localeCompare(y.fullName);
                    });

                setData(memberSearchEntries);
                
            })
            .then(() => {
                setLoadingState({
                    isLoading:false,
                    isError: false,
                });
            })
            .catch((err) => {
                console.error('error fetching group members', err);
                setLoadingState({
                    isLoading:false,
                    isError: true,
                });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);  // using empty list as watch so it runs only once upon first init.
    return {
        results,
        all,
        isLoadinig: loadingState.isLoading,
        isError: loadingState.isError,
        setQuery,
    }    
};