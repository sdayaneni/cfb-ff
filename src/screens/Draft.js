import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 
import DraftNew from './subscreens/DraftNew.js';
import Drafted from './subscreens/Drafted.js';

const Tab = createBottomTabNavigator();

export default function Draft ({route}) {
    return(
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Draft New') {
                        iconName = focused ? 'plus' : 'plus';
                        return <FontAwesome5 name={iconName} size={size} color={color} />;
                    } else if (route.name === 'Drafted') {
                        iconName = focused ? 'team' : 'team';
                        return <AntDesign name={iconName} size={size} color={color} />;
                    }
                    // else if (route.name === 'Create') {
                    //     iconName = focused ? 'plus' : 'plus';
                    // }

                    // You can return any component that you like here!
                },
            tabBarActiveTintColor: '#b98dfc',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
                backgroundColor: "black"
            }
        })}
        >
            <Tab.Screen options={{ headerShown: false }} name="Draft New"  children={()=><DraftNew league={route.params.league}/>}/>
            <Tab.Screen options={{ headerShown: false }} name="Drafted" children={()=><Drafted league={route.params.league}/>}/>
            {/* <Tab.Screen options={{ headerShown: false }} name="Create" component={CreateLeague} /> */}
        </Tab.Navigator>
    );
}