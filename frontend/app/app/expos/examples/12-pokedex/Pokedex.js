import React from "react";
import { Platform, View, Text, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import PokemonList from "./screens/PokemonList";
import MoveList from "./screens/MoveList";
import Calender from "./screens/PokemonDetail";
import MoveDetail from "./screens/MoveDetail";
//import Calender from "./screens/Calender";


import pokemonTabIcon from "../../assets/pokedex/pokemon-active.png";
import moveTabIcon from "../../assets/pokedex/move-active.png";

// https://reactnavigation.org/docs/stack-navigator/
const PokemonStack = createStackNavigator();
const MoveStack = createStackNavigator();
const stackScreenOptions = {
  headerShown: false,
  gestureEnabled: true,
};

function PokemonStackScreen2() {
  return (
    <PokemonStack.Navigator screenOptions={stackScreenOptions}>
      <PokemonStack.Screen name="PokemonList" component={PokemonList} />
      <PokemonStack.Screen name="PokemonDetail" component={Calender} />
    </PokemonStack.Navigator>
  );
}

function PokemonStackScreen() {
  return (
    <PokemonStack.Navigator screenOptions={stackScreenOptions}>
      <PokemonStack.Screen name="PokemonList" component={Calender} />
      <PokemonStack.Screen name="PokemonDetail" component={Calender} />
    </PokemonStack.Navigator>
  );
}

function MoveStackScreen() {
  return (
    <MoveStack.Navigator screenOptions={stackScreenOptions}>
      <MoveStack.Screen name="MoveList" component={Calender} />
      <MoveStack.Screen name="MoveDetail" component={MoveDetail} />
    </MoveStack.Navigator>
  );
}

// https://reactnavigation.org/docs/bottom-tab-navigator/
const Tab = createBottomTabNavigator();
const ActiveColor = "#000000";
const InActiveColor = "#00000077";
const tabScreenOptions = ({ route }) => ({
  tabBarIcon: ({ color, size }) => {
    return (
      <View style={{ alignItems: "center" }}>
        <Image
          source={route.name === "Pokemons" ? pokemonTabIcon : moveTabIcon}
          style={{
            opacity: color == ActiveColor ? 1 : 0.5,
            width: size,
            height: size,
          }}
        />
      </View>
    );
  },
});
const tabBarOptions = {
  activeTintColor: ActiveColor,
  inactiveTintColor: InActiveColor,
};

export default function Pokedex() {
  return (
    <>
      <StatusBar style="light" />

      <NavigationContainer>
        <Tab.Navigator
          screenOptions={tabScreenOptions}
          tabBarOptions={tabBarOptions}
        >
          <Tab.Screen name="Pokemons" component={PokemonStackScreen} />
          <Tab.Screen name="Pokemons2" component={PokemonStackScreen2} />
          <Tab.Screen name="Moves" component={MoveStackScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
