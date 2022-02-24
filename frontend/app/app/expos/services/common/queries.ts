import gql from 'graphql-tag';

export const COMMON_GENERATE_UPLOAD_URL = gql`
    mutation CommonGenerateUploadUrl($filename: String!, $contentType: String) {
        commonGenerateUploadUrl(filename: $filename, contentType: $contentType) {
            uploadUrl
            postParams
            destUrl
            curl
        }
    }
`;
