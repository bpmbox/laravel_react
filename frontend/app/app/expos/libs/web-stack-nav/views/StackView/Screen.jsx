import React from 'react';
import { Animated } from 'react-native';

class Screen extends React.PureComponent {
    render() {
        const { children } = this.props;
        return <Animated.View {...this.props}>{children}</Animated.View>;
    }
}
export default Screen;
