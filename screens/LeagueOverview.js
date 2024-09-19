import React from 'react';
import LeagueCard from '../components/LeagueCard';
import background from "../assets/background.png";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import Roster from "./subscreens/Roster";
import Trade from "./subscreens/Trade.js";
import Matchup from "./subscreens/Matchup.js";
import AddPlayers from "./subscreens/AddPlayers";

const Tab = createBottomTabNavigator();

export default function LeagueOverview ({route}) {
    return(
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Roster') {
                        iconName = focused
                        ? 'football-ball'
                        : 'football-ball';
                    } else if (route.name === 'Matchup') {
                        return <MaterialCommunityIcons name="sword-cross" size={size} color={color} />
                    }
                    else if (route.name === 'Add Players') {
                        iconName = focused ? 'plus' : 'plus';
                    }
                    else if (route.name === 'Trade') {
                        return <Ionicons name="swap-horizontal-outline" size={size} color={color} />
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
            <Tab.Screen options={{ headerShown: false }} name="Roster" children={()=><Roster league={route.params.league}/>} />
            <Tab.Screen options={{ headerShown: false }} name="Matchup" children={()=><Matchup league={route.params.league}/>} />
            <Tab.Screen options={{ headerShown: false }} name="Add Players" children={()=><AddPlayers league={route.params.league}/>} />
            <Tab.Screen options={{ headerShown: false }} name="Trade" children={()=><Trade league={route.params.league}/>} />
        </Tab.Navigator>
    );
}