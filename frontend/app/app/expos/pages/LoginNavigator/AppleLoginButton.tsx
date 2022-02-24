import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/UIKit/items/Button';

const AppleLoginButton: FunctionComponent<NSLoginNavigator.AppleLoginButtonProps> = () => {
    const { t } = useTranslation('LoginPage');
    return <Button text={t`Log in with Apple`} onPress={() => {}} narrow />;
};

export const isAppleLoginSupported = () => {
    return false;
};

export default AppleLoginButton;
