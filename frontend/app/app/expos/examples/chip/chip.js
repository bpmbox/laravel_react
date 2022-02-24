import * as React from 'react';
import { Chip } from 'react-native-paper';

const MyComponent = () => (
  <>
  <Chip icon="info" onPress={() => console.log('Pressed')}>Example Chip</Chip>
  <Chip icon="info" onPress={() => console.log('Pressed')}>Example Chip</Chip>
  <Chip icon="info" onPress={() => console.log('Pressed')}>Example Chip</Chip>
  <Chip icon="info" onPress={() => console.log('Pressed')}>Example Chip</Chip>
  <Chip icon="info" onPress={() => console.log('Pressed')}>Example Chip</Chip>
  <Chip icon="info" onPress={() => console.log('Pressed')}>Example Chip</Chip>
  </>
);

export default MyComponent;