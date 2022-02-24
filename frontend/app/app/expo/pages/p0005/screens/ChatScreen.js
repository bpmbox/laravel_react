import * as React from 'react';
import { View, StyleSheet, Platform, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types'
import { GiftedChat } from 'react-native-gifted-chat'

import FirebaseStorage from '../data/FirebaseStorage';

type Props = {
  name?: string,
};

class ChatScreen extends React.Component<Props> {

  state = {
    messages: [],
  };

  get user() {
    //route parame に設定
    console.log(this.props.route.params)
    const { name, chinko } = this.props.route.params;
    return {
      name: name,
      _id: FirebaseStorage.shared.uid,
    };
  }

  componentDidMount() {
    FirebaseStorage.shared.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }

  componentWillUnmount() {
    FirebaseStorage.shared.off();
  }
/**
 * state message にデータをいれる
 * @returns 
 */
  render() {
    return <SafeAreaView style={{ flex: 1 }}>
      <GiftedChat
        messages={this.state.messages}
        onSend={FirebaseStorage.shared.send}
        user={this.user}
      />
    </SafeAreaView>
  }
}

const styles = StyleSheet.create({
});

export default ChatScreen;
