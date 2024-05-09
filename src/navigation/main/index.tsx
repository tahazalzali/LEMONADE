import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../home";

export type RootStackParamList = {
  home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Route() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
            <Stack.Screen
              name="home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
