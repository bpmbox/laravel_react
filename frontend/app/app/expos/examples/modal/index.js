
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextStyle,
  TextProps,
  SectionList,
  Image,
  findNodeHandle,
  Alert,
  Button,
} from 'react-native';

import Modal from 'react-native-modal';

export interface Props {}

export interface State {
  dispA: boolean;
  dispB: boolean;
}

export default class hi extends React.Component<Props, State> {
  /**
   * constructor
   * @param props
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      dispA: false,
      dispB: false,
    };
  }

  toggleA = () => {
    this.setState({
      dispA: !this.state.dispA,
    });
  };

  toggleB = () => {
    this.setState({
      dispB: !this.state.dispB,
    });
  };

  render() {
    const {dispA, dispB} = this.state;

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button title="Aモーダル表示" onPress={this.toggleA} />
        <Button title="Bモーダル表示" onPress={this.toggleB} />
        <Modal
          isVisible={dispA}
          style={{alignContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: '#FFF',

              alignContent: 'center',
            }}>
            <Text style={{textAlign: 'center'}}>Aモーダル</Text>
            <Button title="Aモーダル非表示" onPress={this.toggleA} />
          </View>
        </Modal>
        <Modal
          onModalHide={this.toggleA}
          isVisible={dispB}
          style={{alignContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: '#FFF',

              alignContent: 'center',
            }}>
            <Text style={{textAlign: 'center'}}>Bモーダル</Text>
            <Button
              title="Bモーダル非表示&Aモーダル表示"
              onPress={this.toggleB}
            />
          </View>
        </Modal>
      </View>
    );
  }
}