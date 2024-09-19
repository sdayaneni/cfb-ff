import React from 'react';
import LeagueCard from '../components/LeagueCard';
import background from "../assets/background.png";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons'; 
import YourLeagues from "./subscreens/YourLeagues.js";
import PublicLeagues from "./subscreens/PublicLeagues.js";
import CreateLeague from "./subscreens/CreateLeague.js";

const Tab = createBottomTabNavigator();

export default function Home () {
    return(
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Your Leagues') {
                        iconName = focused
                        ? 'football-ball'
                        : 'football-ball';
                    } else if (route.name === 'Join') {
                        iconName = focused ? 'link' : 'link';
                    }
                    else if (route.name === 'Create') {
                        iconName = focused ? 'plus' : 'plus';
                    }

                    // You can return any component that you like here!
                    return <FontAwesome5 name={iconName} size={size} color={color} />;
                },
            tabBarActiveTintColor: '#9f86fc',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
                backgroundColor: "black"
            }
        })}
        >
            <Tab.Screen options={{ headerShown: false }} name="Your Leagues" component={YourLeagues} />
            <Tab.Screen options={{ headerShown: false }} name="Join" component={PublicLeagues} />
            <Tab.Screen options={{ headerShown: false }} name="Create" component={CreateLeague} />
        </Tab.Navigator>
    );
}