import React from 'react';
import { ActivityIndicator } from 'react-native';
import Center from '../Layout/Center';
import { FunctionComponent } from 'react';
import { Color } from '../../../theme.style';

type ComponentProps = {
    small?: boolean
};

const Spinner: FunctionComponent<ComponentProps> = (props) => {
    return <Center>
        <ActivityIndicator size={props.small ? 'small' : 'large'} color={Color.accent4.valueOf()}/>
    </Center>
};

export default Spinner;
