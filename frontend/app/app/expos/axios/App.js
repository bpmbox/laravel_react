import * as React from 'react';
import { Text, View, Button, StyleSheet, ScrollText } from 'react-native';
import useAxios from 'axios-hooks';

import { Card } from 'react-native-paper';

export default function Axois() {
   const [{ data, loading, error }, refetch] = useAxios(
    'https://reqres.in/api/users?delay=1',
    {
      manual: true,
    }
  )

  if (loading) return <Text>Loading...</Text>
  if (error) return <ScrollText>{JSON.stringify(error, null, 2)}</ScrollText>

    return (
      <View style={styles.container}>
        <Button onPress={()=> refetch({
          data: {
            delay: 2
          }
        })} title="Refetch" />
        <Text style={styles.paragraph}>{JSON.stringify(data, null, 2)}</Text>
      </View>
    );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    marginTop: 8,
    fontFamily: 'Monospace'
  },
});
