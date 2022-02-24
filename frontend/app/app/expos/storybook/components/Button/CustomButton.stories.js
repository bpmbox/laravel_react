import React from 'react';
import { storiesOf } from '@storybook/react-native';

import CustomButton from './CustomButton';
import { View, Text } from 'react-native';

import { radios } from '@storybook/addon-knobs';

import { action } from '@storybook/addon-actions';

const buttonStories = storiesOf('Buttons', module);

const colorOptions = ['hotpink', 'cyan'];

buttonStories.add('default view', () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <CustomButton onPress={action("button")}>
      <Text>Press Me </Text>
    </CustomButton>
  </View>
));

buttonStories.add('pick the color', () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <CustomButton
      onPress={action("button2")}
      backgroundColor={radios('color', colorOptions, colorOptions[0])}>
      <Text>pick color in addons tab </Text>
    </CustomButton>
  </View>
));
