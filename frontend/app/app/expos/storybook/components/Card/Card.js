import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Card } from 'react-native-paper';

export default function CustomCard({ text }) {
  return (
    <Card>
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
        <Image
          style={styles.logo}
          source={require('../../assets/snack-icon.png')}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    height: 128,
    width: 128,
  },
});
