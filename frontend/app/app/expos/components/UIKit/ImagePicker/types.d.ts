declare namespace NSImagePicker {
    type ImagePickerProps = {
        allowSelection?: boolean;
        buttonTitle?: string;
        customComponent?: React.Component;
        desktopWidth?: ItemWidth;
        imageUrl?: string;
        includeButton?: boolean;
        includePreview?: boolean;
        integration?: boolean;
        onError?: (e: Error) => void;
        onUploaded?: (fileUrl: string) => void;
        profile?: boolean;
        round?: boolean;
        setIsUploading?: (value: boolean) => void;
        space?: boolean;
    } & ItemProps;
}
