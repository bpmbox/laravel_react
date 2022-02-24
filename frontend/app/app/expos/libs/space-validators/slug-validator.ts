import debounce from 'lodash/debounce';
import { useState } from 'react';
import messageService from '../../services/message';
import spaceService from '../../services/space';
import i18next from '../../i18n';

// Note: debounce method must be defined outside of calling function scope to prevent it from
// being redefined, since we must invoke the same instance each time.
const debouncedValidateSlug = debounce(async (slug: string, setValidating: (validating: boolean) => void): Promise<boolean> => {
    const result = await spaceService.checkSlugNotTaken(slug);

    if (!result) {
        const message = i18next.t('SpaceValidators::Space domain "{{slug}}" is already taken.', { slug });
        const alertTitle = i18next.t('SpaceValidators::Alert');
        messageService.sendWarning(message, alertTitle);
    }
    setValidating(false);
    return result;

}, 1000, { trailing: true });


export default function useSpaceSlugValidator(): NSSpaceValidators.ISpaceSlugValidator {
    const [validating, setValidating] = useState(false);    

    const validateSlug = async (slug: string): Promise<boolean> => {
        // Only set to true if not validating state to prevent component being rerendered.
        !validating && setValidating(true);

        return debouncedValidateSlug(slug, setValidating);
    };

    return {
        validating,
        validateSlug,
    };
}
