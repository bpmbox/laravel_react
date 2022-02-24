/**
 * TouchableItem renders a touchable that looks native on both iOS and Android.
 *
 * It provides an abstraction on top of TouchableNativeFeedback and
 * TouchableOpacity.
 *
 * On iOS you can pass the props of TouchableOpacity, on Android pass the props
 * of TouchableNativeFeedback.
 */
import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';

import BorderlessButton from './BorderlessButton';

export default class TouchableItem extends React.Component {
  static defaultProps = {
    borderless: false,
    pressColor: 'rgba(0, 0, 0, .32)',
  };

  render() {
    if (Platform.OS === 'ios') {
      return (
        <BorderlessButton
          hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
          disallowInterruption
          {...this.props}
        >
          {this.props.children}
        </BorderlessButton>
      );
    } else {
      return (
        <TouchableOpacity {...this.props}>
          {this.props.children}
        </TouchableOpacity>
      );
    }
  }
}
