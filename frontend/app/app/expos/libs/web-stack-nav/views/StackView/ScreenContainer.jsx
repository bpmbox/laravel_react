import React from 'react';
import { View } from 'react-native';

class ScreenContainer extends React.PureComponent {
    render() {
        const { children } = this.props;
        return <View {...this.props}>{children}</View>;
    }
}
export default ScreenContainer;
