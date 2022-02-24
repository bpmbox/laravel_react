/* istanbul ignore file */
// Ignore for now because we need to adapt File to be compatible with both rn/rnweb
// TODO: show file size before download?
// TODO: show toast/progress when downloading?
//   progress: https://github.com/itinance/react-native-fs#downloadfileoptions-downloadfileoptions--jobid-number-promise-promisedownloadresult-

import omit from 'lodash/omit';
import React, { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconId } from '../../../../assets/native/svg-icons';
import { ItemProps } from '../../../../components/UIKit/Item';
import SimpleListItem from '../../../../components/UIKit/items/SimpleListItem';

type FileProps = {
    value: string;   // TODO: url strong type?
} & ItemProps;

const File: FunctionComponent<FileProps> = (props) => {
    const { t } = useTranslation('OnboardingCreateSpacePage');
    let [fileSize, setFileSize] = useState("");

    // strip leading folder from file path
    const fileName = props.value.replace(/^.*[\\/]/, '') || "unnamed.dat";

    // Returns a short file size string such as "32kb" or "1.7mb".
    const fileSizeText = (bytes: number): string => {
        if (bytes < 1000) {
            return t('{{size}}B', {size: bytes});
        } else if (bytes < 1000000) {
            return t('{{size}}KB', {size: (bytes / 1000).toFixed(0)});
        } else if (bytes < 1000000000) {
            return t('{{size}}MB', {size: (bytes / 1000000).toFixed(1)});
        } else {
            return t('{{size}}BB', {size: (bytes / 1000000000).toFixed(1)});
        }
    };

    // Called when the file is tapped. Downloads and displays the file.
    const onFilePress = () => {
        // TODO: Just call here for bypassing lint for now
        setFileSize("0");
        fileSizeText(0);

        // const targetFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
        // RNFS.downloadFile({
        //     fromUrl: props.value,
        //     toFile: `${RNFS.DocumentDirectoryPath}/${fileName}`,
        // }).promise.then((result) => {
        //     setFileSize(fileSizeText(result.bytesWritten));
        //     FileViewer.open(targetFilePath, {showOpenWithDialog: false})
        //         .then(() => {
        //             console.log(`Opened ${targetFilePath}!`);
        //         })
        //         .catch(error => {
        //             console.log(`Error opening ${targetFilePath}: ${error}`);
        //         });
        // }).catch(error => {
        //     // TODO: alert/toast?
        //     console.log(`Error downloading: ${error}`);
        // });
    };

    return <SimpleListItem
        text={fileName}
        iconId={IconId.multicolor_file}
        accessoryText={fileSize}
        onPress={onFilePress}
        {...omit(props, 'value')} />
};

export default File;
