import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Feather from "react-native-vector-icons/Feather";
import FeedScreen from "../../screens/feed";

export type HomeStackParamList = {
  feed: undefined;
};

const Tab = createMaterialBottomTabNavigator<HomeStackParamList>();

export default function HomeScreen() {

  return (
    <Tab.Navigator
      barStyle={{ backgroundColor: "#1f1b1b", height: 80}}
      initialRouteName="feed"
    >
      <Tab.Screen
        name="feed"
        
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color }:{color:string}) => (
            <Feather name="home" size={24} color={color} />
          ),
      
        
        }}
      />
  
    </Tab.Navigator>
  );
}
