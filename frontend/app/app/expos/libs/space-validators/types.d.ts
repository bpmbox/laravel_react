declare namespace NSSpaceValidators {

    interface ISpaceNameValidator {
        validating: boolean; validateName: (name: string)
            => Promise<boolean>
    } 

    interface ISpaceSlugValidator {
        validating: boolean; validateSlug: (slug: string)
            => Promise<boolean>
    }
}
