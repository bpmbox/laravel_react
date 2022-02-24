import React from 'react';

import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';

import HelloWorld1 from '../examples/1-hello-world/1.HelloWorld1';
import HelloWorld2 from '../examples/1-hello-world/2.HelloWorld2';
import MomoLogin from '../examples/2-login-screen/1.MomoLogin';
import FacebookLogin from '../examples/2-login-screen/2.FacebookLogin';
import TheLight from '../examples/3-the-light/1.TheLight';
import TrafficLight from '../examples/3-the-light/2.TrafficLight';
import RegisterForm from '../examples/4-register-form/RegisterForm';
import InstagramFeed from '../examples/5-instagram-feed/InstagramFeed';
import RockPaperScissors from '../examples/6-rock-paper-scissors/RockPaperScissors';
import ScanQrCode from '../examples/7-scan-qr-code/ScanQrCode';
import StopWatch from '../examples/8-stopwatch/StopWatch';
import BMICalculator from '../examples/9-bmi-calculator/BMICalculator';
import MusicPlayer from '../examples/10-music-player/MusicPlayer';
import WorldwideNews from '../examples/11-news/WorldwideNews';
import Pokedex from '../examples/12-pokedex/Pokedex';
import AgendaScreen from '../examples/13-calender/calender';
import Apitest from '../examples/apitest/index';
import Apitesta from '../examples/apitest/index';
import Apitestb from '../examples/apitest/index';
import Apitestc from '../examples/apitest/index';
import ModalTestScreen from '../examples/modal/index';
import MyComponent from '../examples/chip/chip';
import Appl from '../examples/with-apollo/Appl';

//
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//Navigerter の作成
const Stack = createStackNavigator();

export default function Chat() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ gestureEnabled: true }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Appl" component={Appl} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Chat２" component={HelloWorld1} />
        <Stack.Screen name="Cha444" component={ChatScreen} />
        <Stack.Screen name="Chat555" component={ChatScreen} />                
      </Stack.Navigator>
    </NavigationContainer>
  );
}
